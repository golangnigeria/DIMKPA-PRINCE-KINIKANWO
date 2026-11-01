package config

import (
	"os"
	"strings"
)

type Config struct {
	Port          string
	AppEnv        string
	DatabaseURL   string
	JWTSecret     string
	AdminEmail    string
	AdminPassword string
	CORSOrigins   []string

	// SMTP config
	SMTPHost              string
	SMTPPort              string
	SMTPUser              string
	SMTPPass              string
	ContactRecipientEmail string
	OwnerName             string
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); strings.TrimSpace(val) != "" {
		return strings.TrimSpace(val)
	}
	return defaultVal
}

func LoadConfig() *Config {
	env := getEnv("APP_ENV", "development")

	defaultDbURL := ""
	if env == "production" {
		defaultDbURL = "postgres://pxxluser_1a192e90bbdf1dc:8UbORSz%26e%26pwjx1RBsK662HCuohFXAg5@8c008pb44.pxxldb.pxxl.pro:39700/pxxldb_1a192e90bbdefd8?sslmode=disable"
	}

	dbURL := getEnv("DATABASE_URL", defaultDbURL)

	corsRaw := getEnv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
	var origins []string
	for _, orig := range strings.Split(corsRaw, ",") {
		if o := strings.TrimSpace(orig); o != "" {
			origins = append(origins, o)
		}
	}

	return &Config{
		Port:                  getEnv("GO_PORT", getEnv("BACKEND_PORT", "8080")),
		AppEnv:                env,
		DatabaseURL:           dbURL,
		JWTSecret:             getEnv("JWT_SECRET", "portfolio-super-secret-jwt-key-2026"),
		AdminEmail:            getEnv("ADMIN_EMAIL", "stackninja.pro@gmail.com"),
		AdminPassword:         getEnv("ADMIN_PASSWORD", "Admin@inUS2"),
		CORSOrigins:           origins,
		SMTPHost:              os.Getenv("SMTP_HOST"),
		SMTPPort:              getEnv("SMTP_PORT", "465"),
		SMTPUser:              os.Getenv("SMTP_USER"),
		SMTPPass:              os.Getenv("SMTP_PASS"),
		ContactRecipientEmail: getEnv("CONTACT_RECIPIENT_EMAIL", os.Getenv("SMTP_USER")),
		OwnerName:             getEnv("OWNER_NAME", "Dimkpa Prince"),
	}
}

