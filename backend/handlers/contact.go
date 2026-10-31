package handlers

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"

	"portfolio-backend/database"
	"portfolio-backend/services"
)

var emailRegex = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)

type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Budget  string `json:"budget"`
	Message string `json:"message"`
}

type ContactHandler struct {
	db           *database.DB
	emailService *services.EmailService
}

func NewContactHandler(db *database.DB, emailService *services.EmailService) *ContactHandler {
	return &ContactHandler{db: db, emailService: emailService}
}

func (h *ContactHandler) Submit(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req ContactRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Invalid JSON payload"}`))
		return
	}

	name := strings.TrimSpace(req.Name)
	email := strings.TrimSpace(req.Email)
	budget := strings.TrimSpace(req.Budget)
	message := strings.TrimSpace(req.Message)

	w.Header().Set("Content-Type", "application/json")

	if name == "" || email == "" || message == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Name, email and message are required."}`))
		return
	}

	if !emailRegex.MatchString(email) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Please provide a valid email address."}`))
		return
	}

	if len(name) > 120 || len(email) > 200 || len(message) > 5000 {
		w.WriteHeader(http.StatusRequestEntityTooLarge)
		w.Write([]byte(`{"error":"Payload too large."}`))
		return
	}

	forwarded := r.Header.Get("X-Forwarded-For")
	var ip string
	if forwarded != "" {
		ip = strings.TrimSpace(strings.Split(forwarded, ",")[0])
	}
	userAgent := r.Header.Get("User-Agent")

	submissionID := uuid.New().String()
	now := time.Now().UTC()

	var err error
	if h.db.DriverName == "pgx" {
		query := `
		INSERT INTO contact_submissions (id, name, email, budget, message, source, user_agent, ip_address, created_at)
		VALUES ($1, $2, $3, $4, $5, 'portfolio', $6, $7, $8)`
		_, err = h.db.Exec(query, submissionID, name, email, budget, message, userAgent, ip, now)
	} else {
		query := `
		INSERT INTO contact_submissions (id, name, email, budget, message, source, user_agent, ip_address, created_at)
		VALUES (?, ?, ?, ?, ?, 'portfolio', ?, ?, ?)`
		_, err = h.db.Exec(query, submissionID, name, email, budget, message, userAgent, ip, now)
	}

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Could not save your message. Please try again."}`))
		return
	}

	// Trigger async email notification if SMTP is configured
	h.emailService.AsyncNotify(name, email, budget, message, func(sent bool, errStr string) {
		if h.db.DriverName == "pgx" {
			h.db.Exec("UPDATE contact_submissions SET email_sent = $1, email_error = $2 WHERE id = $3", sent, errStr, submissionID)
		} else {
			h.db.Exec("UPDATE contact_submissions SET email_sent = ?, email_error = ? WHERE id = ?", sent, errStr, submissionID)
		}
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"ok":true}`))
}

