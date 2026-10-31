package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"portfolio-backend/database"
)

type ContactSubmission struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Email      string  `json:"email"`
	Budget     *string `json:"budget"`
	Message    string  `json:"message"`
	Source     *string `json:"source"`
	UserAgent  *string `json:"user_agent"`
	IPAddress  *string `json:"ip_address"`
	CreatedAt  string  `json:"created_at"`
	EmailSent  *bool   `json:"email_sent"`
	EmailError *string `json:"email_error"`
}

type AdminHandler struct {
	db *database.DB
}

func NewAdminHandler(db *database.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

func (h *AdminHandler) Stats(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var total int
	var last7Days int
	var latest sql.NullTime

	sevenDaysAgo := time.Now().UTC().Add(-7 * 24 * time.Hour)

	if h.db.DriverName == "pgx" {
		err := h.db.QueryRow("SELECT COUNT(*) FROM contact_submissions").Scan(&total)
		if err != nil {
			http.Error(w, `{"error":"Failed to count submissions"}`, http.StatusInternalServerError)
			return
		}
		_ = h.db.QueryRow("SELECT COUNT(*) FROM contact_submissions WHERE created_at >= $1", sevenDaysAgo).Scan(&last7Days)
		_ = h.db.QueryRow("SELECT created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 1").Scan(&latest)
	} else {
		err := h.db.QueryRow("SELECT COUNT(*) FROM contact_submissions").Scan(&total)
		if err != nil {
			http.Error(w, `{"error":"Failed to count submissions"}`, http.StatusInternalServerError)
			return
		}
		_ = h.db.QueryRow("SELECT COUNT(*) FROM contact_submissions WHERE created_at >= ?", sevenDaysAgo.Format("2006-01-02 15:04:05")).Scan(&last7Days)
		_ = h.db.QueryRow("SELECT created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 1").Scan(&latest)
	}

	var latestStr *string
	if latest.Valid {
		str := latest.Time.Format(time.RFC3339)
		latestStr = &str
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"total":     total,
		"last7Days": last7Days,
		"latest":    latestStr,
	})
}

func (h *AdminHandler) ListSubmissions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	q := strings.TrimSpace(r.URL.Query().Get("q"))
	pageStr := r.URL.Query().Get("page")
	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	pageSize := 25
	limitStr := r.URL.Query().Get("limit")
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
		pageSize = l
	}

	var total int
	var countQuery, selectQuery string
	var args []interface{}
	likePattern := "%" + q + "%"

	if h.db.DriverName == "pgx" {
		if q != "" {
			countQuery = `SELECT COUNT(*) FROM contact_submissions 
				WHERE name ILIKE $1 OR email ILIKE $1 OR message ILIKE $1`
			selectQuery = `SELECT id, name, email, budget, message, source, user_agent, ip_address, created_at, email_sent, email_error 
				FROM contact_submissions 
				WHERE name ILIKE $1 OR email ILIKE $1 OR message ILIKE $1 
				ORDER BY created_at DESC LIMIT $2 OFFSET $3`
			args = []interface{}{likePattern}
		} else {
			countQuery = `SELECT COUNT(*) FROM contact_submissions`
			selectQuery = `SELECT id, name, email, budget, message, source, user_agent, ip_address, created_at, email_sent, email_error 
				FROM contact_submissions 
				ORDER BY created_at DESC LIMIT $1 OFFSET $2`
		}
	} else {
		// SQLite (LIKE is case-insensitive for ASCII)
		if q != "" {
			countQuery = `SELECT COUNT(*) FROM contact_submissions 
				WHERE name LIKE ? OR email LIKE ? OR message LIKE ?`
			selectQuery = `SELECT id, name, email, budget, message, source, user_agent, ip_address, created_at, email_sent, email_error 
				FROM contact_submissions 
				WHERE name LIKE ? OR email LIKE ? OR message LIKE ? 
				ORDER BY created_at DESC LIMIT ? OFFSET ?`
			args = []interface{}{likePattern, likePattern, likePattern}
		} else {
			countQuery = `SELECT COUNT(*) FROM contact_submissions`
			selectQuery = `SELECT id, name, email, budget, message, source, user_agent, ip_address, created_at, email_sent, email_error 
				FROM contact_submissions 
				ORDER BY created_at DESC LIMIT ? OFFSET ?`
		}
	}

	if err := h.db.QueryRow(countQuery, args...).Scan(&total); err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"Failed to count submissions: %v"}`, err), http.StatusInternalServerError)
		return
	}

	pageCount := int(math.Max(1, math.Ceil(float64(total)/float64(pageSize))))
	if page > pageCount {
		page = pageCount
	}

	offset := (page - 1) * pageSize
	var queryArgs []interface{}
	queryArgs = append(queryArgs, args...)
	queryArgs = append(queryArgs, pageSize, offset)

	rows, err := h.db.Query(selectQuery, queryArgs...)
	if err != nil {
		http.Error(w, fmt.Sprintf(`{"error":"Failed to query submissions: %v"}`, err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	submissions := make([]ContactSubmission, 0)
	for rows.Next() {
		var s ContactSubmission
		var createdAt time.Time
		var budget, source, userAgent, ipAddress, emailError sql.NullString
		var emailSent sql.NullBool

		err := rows.Scan(
			&s.ID, &s.Name, &s.Email, &budget, &s.Message,
			&source, &userAgent, &ipAddress, &createdAt,
			&emailSent, &emailError,
		)
		if err != nil {
			http.Error(w, fmt.Sprintf(`{"error":"Failed to scan submission: %v"}`, err), http.StatusInternalServerError)
			return
		}

		if budget.Valid {
			s.Budget = &budget.String
		}
		if source.Valid {
			s.Source = &source.String
		}
		if userAgent.Valid {
			s.UserAgent = &userAgent.String
		}
		if ipAddress.Valid {
			s.IPAddress = &ipAddress.String
		}
		if emailError.Valid {
			s.EmailError = &emailError.String
		}
		if emailSent.Valid {
			s.EmailSent = &emailSent.Bool
		}
		s.CreatedAt = createdAt.Format(time.RFC3339)

		submissions = append(submissions, s)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"rows":      submissions,
		"total":     total,
		"page":      page,
		"pageCount": pageCount,
	})
}

func (h *AdminHandler) DeleteSubmission(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// r.PathValue("id") from Go 1.22+ mux
	id := r.PathValue("id")
	if id == "" {
		// Fallback for query param or url suffix
		parts := strings.Split(r.URL.Path, "/")
		if len(parts) > 0 {
			id = parts[len(parts)-1]
		}
	}

	if id == "" {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(`{"error":"Submission ID required"}`))
		return
	}

	var err error
	if h.db.DriverName == "pgx" {
		_, err = h.db.Exec("DELETE FROM contact_submissions WHERE id = $1", id)
	} else {
		_, err = h.db.Exec("DELETE FROM contact_submissions WHERE id = ?", id)
	}

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to delete submission"}`))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"ok":true}`))
}

