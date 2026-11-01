package handlers

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

var allowedPreviewHosts = map[string]bool{
	"curexal.space":       true,
	"www.curexal.space":   true,
	"inverexglobal.com":   true,
	"www.inverexglobal.com": true,
	"getweys.com":         true,
	"www.getweys.com":     true,
	"promptstore.io":      true,
	"www.promptstore.io":  true,
	"clipsaves.com":       true,
	"www.clipsaves.com":   true,
}

type PreviewHandler struct {
	client *http.Client
}

func NewPreviewHandler() *PreviewHandler {
	return &PreviewHandler{
		client: &http.Client{
			Timeout: 12 * time.Second,
		},
	}
}

func (h *PreviewHandler) Handle(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	target := strings.TrimSpace(r.URL.Query().Get("url"))
	if target == "" {
		http.Error(w, "Missing url parameter", http.StatusBadRequest)
		return
	}

	parsed, err := url.Parse(target)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		http.Error(w, "Invalid URL parameter", http.StatusBadRequest)
		return
	}

	host := strings.ToLower(parsed.Hostname())
	if !allowedPreviewHosts[host] {
		http.Error(w, "Host not allowed for preview", http.StatusForbidden)
		return
	}

	req, err := http.NewRequestWithContext(r.Context(), http.MethodGet, parsed.String(), nil)
	if err != nil {
		http.Error(w, "Failed to create upstream request", http.StatusInternalServerError)
		return
	}

	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
	req.Header.Set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8")

	resp, err := h.client.Do(req)
	if err != nil {
		http.Error(w, fmt.Sprintf("Upstream fetch failed: %v", err), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	contentType := resp.Header.Get("Content-Type")
	if !strings.Contains(contentType, "text/html") {
		w.Header().Set("Content-Type", contentType)
		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)
		return
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read upstream body", http.StatusBadGateway)
		return
	}

	html := string(bodyBytes)
	baseHref := fmt.Sprintf("%s://%s/", parsed.Scheme, parsed.Host)

	injection := fmt.Sprintf(`
      <base href="%s" target="_blank" />
      <style>
        html, body {
          overflow-x: hidden !important;
          scrollbar-width: none !important;
        }
        ::-webkit-scrollbar { display: none !important; }
      </style>
    `, baseHref)

	if strings.Contains(html, "<head>") {
		html = strings.Replace(html, "<head>", "<head>"+injection, 1)
	} else if strings.Contains(html, "<HEAD>") {
		html = strings.Replace(html, "<HEAD>", "<HEAD>"+injection, 1)
	} else {
		html = injection + html
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Cache-Control", "public, max-age=1800, s-maxage=3600")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(html))
}

