package middleware

import (
	"net/http"
	"strings"

	"portfolio-backend/config"
)

func EnableCORS(cfg *config.Config, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		allowed := false
		if len(cfg.CORSOrigins) == 0 {
			allowed = true
		} else {
			for _, o := range cfg.CORSOrigins {
				if o == "*" || strings.EqualFold(o, origin) {
					allowed = true
					break
				}
			}
		}

		if allowed && origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Cookie")
		}

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

