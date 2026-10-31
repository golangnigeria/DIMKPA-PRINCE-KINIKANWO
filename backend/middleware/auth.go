package middleware

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"portfolio-backend/config"
)

type contextKey string

const AdminContextKey contextKey = "admin_user"

type Claims struct {
	UserID string `json:"user_id"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

type TokenService struct {
	secret []byte
}

func NewTokenService(cfg *config.Config) *TokenService {
	return &TokenService{secret: []byte(cfg.JWTSecret)}
}

func (ts *TokenService) GenerateToken(userID, email string) (string, error) {
	claims := Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   userID,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(ts.secret)
}

func (ts *TokenService) ValidateToken(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return ts.secret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

func (ts *TokenService) ExtractToken(r *http.Request) string {
	// Check Authorization header
	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}

	// Check cookie
	if cookie, err := r.Cookie("admin_session"); err == nil {
		return cookie.Value
	}

	return ""
}

func (ts *TokenService) RequireAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenStr := ts.ExtractToken(r)
		if tokenStr == "" {
			http.Error(w, `{"error":"Unauthorized"}`, http.StatusUnauthorized)
			return
		}

		claims, err := ts.ValidateToken(tokenStr)
		if err != nil {
			http.Error(w, `{"error":"Invalid or expired session"}`, http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), AdminContextKey, claims)
		next(w, r.WithContext(ctx))
	}
}

func (ts *TokenService) OptionalAdmin(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenStr := ts.ExtractToken(r)
		if tokenStr != "" {
			if claims, err := ts.ValidateToken(tokenStr); err == nil {
				ctx := context.WithValue(r.Context(), AdminContextKey, claims)
				next(w, r.WithContext(ctx))
				return
			}
		}
		next(w, r)
	}
}

