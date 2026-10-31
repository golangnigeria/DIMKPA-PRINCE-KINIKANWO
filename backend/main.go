package main

import (
	"fmt"
	"log"
	"net/http"

	"portfolio-backend/config"
	"portfolio-backend/database"
	"portfolio-backend/handlers"
	"portfolio-backend/middleware"
	"portfolio-backend/services"
)

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

	handler := middleware.EnableCORS(cfg, mux)

	addr := ":" + cfg.Port
	log.Printf("Backend HTTP server listening on %s", addr)
	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to run: %v", err)
	}
}

