package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"

	"portfolio-backend/database"
	"portfolio-backend/middleware"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthHandler struct {
	db           *database.DB
	tokenService *middleware.TokenService
}

func NewAuthHandler(db *database.DB, tokenService *middleware.TokenService) *AuthHandler {
	return &AuthHandler{db: db, tokenService: tokenService}
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid request payload"}`))
		return
	}

	email := strings.ToLower(strings.TrimSpace(req.Email))
	password := strings.TrimSpace(req.Password)

	if email == "" || password == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Email and password are required."}`))
		return
	}

	var userID, storedHash string
	var err error
	if h.db.DriverName == "pgx" {
		err = h.db.QueryRow("SELECT id, password_hash FROM admin_users WHERE LOWER(email) = $1", email).Scan(&userID, &storedHash)
	} else {
		err = h.db.QueryRow("SELECT id, password_hash FROM admin_users WHERE LOWER(email) = ?", email).Scan(&userID, &storedHash)
	}

	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"error":"Invalid email or password."}`))
			return
		}
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Database error"}`))
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"error":"Invalid email or password."}`))
		return
	}

	token, err := h.tokenService.GenerateToken(userID, email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to generate auth token"}`))
		return
	}

	// Set cookie for browser and server actions
	http.SetCookie(w, &http.Cookie{
		Name:     "admin_session",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // set to true in production with HTTPS if desired
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
	})

	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok":    true,
		"token": token,
		"user": map[string]string{
			"id":    userID,
			"email": email,
		},
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "admin_session",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	})

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"ok":true}`))
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	val := r.Context().Value(middleware.AdminContextKey)
	if val == nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "signed-out",
		})
		return
	}

	claims, ok := val.(*middleware.Claims)
	if !ok {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status": "signed-out",
		})
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"status": "admin",
		"user": map[string]string{
			"id":    claims.UserID,
			"email": claims.Email,
		},
	})
}

