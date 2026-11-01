package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"strings"

	"portfolio-backend/config"
	"portfolio-backend/database"
	"portfolio-backend/handlers"
	"portfolio-backend/middleware"
	"portfolio-backend/services"
)

//go:embed all:dist
var staticFiles embed.FS

func main() {
	cfg := config.LoadConfig()

	log.Printf("Starting Portfolio Backend (Environment: %s)", cfg.AppEnv)

	db, err := database.Connect(cfg)
	if err != nil {
		log.Fatalf("Database connection error: %v", err)
	}
	defer db.Close()

	emailService := services.NewEmailService(cfg)
	tokenService := middleware.NewTokenService(cfg)

	contactHandler := handlers.NewContactHandler(db, emailService)
	authHandler := handlers.NewAuthHandler(db, tokenService)
	adminHandler := handlers.NewAdminHandler(db)
	previewHandler := handlers.NewPreviewHandler()

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status":"ok","env":"%s","driver":"%s"}`, cfg.AppEnv, db.DriverName)
	})

	// Public contact endpoint
	mux.HandleFunc("POST /api/contact", contactHandler.Submit)

	// Auth endpoints
	mux.HandleFunc("POST /api/auth/login", authHandler.Login)
	mux.HandleFunc("POST /api/auth/logout", authHandler.Logout)
	mux.HandleFunc("GET /api/auth/me", tokenService.OptionalAdmin(authHandler.Me))

	// Admin protected endpoints
	mux.HandleFunc("GET /api/admin/stats", tokenService.RequireAdmin(adminHandler.Stats))
	mux.HandleFunc("GET /api/admin/submissions", tokenService.RequireAdmin(adminHandler.ListSubmissions))
	mux.HandleFunc("DELETE /api/admin/submissions/{id}", tokenService.RequireAdmin(adminHandler.DeleteSubmission))

	// Live project preview proxy
	mux.HandleFunc("GET /api/preview", previewHandler.Handle)

	// Static frontend file server from embedded assets
	distFS, err := fs.Sub(staticFiles, "dist")
	if err != nil {
		log.Fatalf("Failed to initialize static assets filesystem: %v", err)
	}
	fileServer := http.FileServer(http.FS(distFS))

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Do not handle unmatched /api routes as static files
		if strings.HasPrefix(r.URL.Path, "/api/") {
			http.NotFound(w, r)
			return
		}

		p := strings.TrimPrefix(r.URL.Path, "/")
		if p == "" {
			p = "index.html"
		}

		// 1. Direct file check
		if f, err := distFS.Open(p); err == nil {
			f.Close()
			fileServer.ServeHTTP(w, r)
			return
		}

		// 2. Try clean URL path + ".html" (e.g. /admin -> admin.html)
		htmlPath := p + ".html"
		if f, err := distFS.Open(htmlPath); err == nil {
			f.Close()
			r2 := new(http.Request)
			*r2 = *r
			r2.URL = new(url.URL)
			*r2.URL = *r.URL
			r2.URL.Path = "/" + htmlPath
			fileServer.ServeHTTP(w, r2)
			return
		}

		// 3. Try directory index path + "/index.html"
		indexPath := strings.TrimSuffix(p, "/") + "/index.html"
		if f, err := distFS.Open(indexPath); err == nil {
			f.Close()
			r2 := new(http.Request)
			*r2 = *r
			r2.URL = new(url.URL)
			*r2.URL = *r.URL
			r2.URL.Path = "/" + indexPath
			fileServer.ServeHTTP(w, r2)
			return
		}

		// 4. Fallback to 404.html
		if f, err := distFS.Open("404.html"); err == nil {
			f.Close()
			w.WriteHeader(http.StatusNotFound)
			r2 := new(http.Request)
			*r2 = *r
			r2.URL = new(url.URL)
			*r2.URL = *r.URL
			r2.URL.Path = "/404.html"
			fileServer.ServeHTTP(w, r2)
			return
		}

		fileServer.ServeHTTP(w, r)
	})

	handler := middleware.EnableCORS(cfg, mux)

	addr := ":" + cfg.Port
	log.Printf("Portfolio Server listening on %s (serving static UI & API)", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to run: %v", err)
	}
}
