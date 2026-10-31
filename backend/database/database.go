package database

import (
	"database/sql"
	"fmt"
	"log"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	_ "modernc.org/sqlite"

	"portfolio-backend/config"
)

type DB struct {
	*sql.DB
	DriverName string
}

func Connect(cfg *config.Config) (*DB, error) {
	var driver string
	var dsn string

	isPostgres := strings.HasPrefix(cfg.DatabaseURL, "postgres://") || strings.HasPrefix(cfg.DatabaseURL, "postgresql://")

	if cfg.AppEnv == "production" || isPostgres {
		driver = "pgx"
		dsn = cfg.DatabaseURL
		// If sslmode is not specified, ensure sslmode=disable for this database
		if !strings.Contains(dsn, "sslmode=") {
			sep := "?"
			if strings.Contains(dsn, "?") {
				sep = "&"
			}
			dsn = dsn + sep + "sslmode=disable"
		}
		// If password has raw '&' not percent encoded
		// Replace &e& with %26e%26 if present
		if strings.Contains(dsn, "8UbORSz&e&pwjx1RBsK662HCuohFXAg5") {
			dsn = strings.ReplaceAll(dsn, "8UbORSz&e&pwjx1RBsK662HCuohFXAg5", "8UbORSz%26e%26pwjx1RBsK662HCuohFXAg5")
		}
		log.Printf("Connecting to PostgreSQL...")
	} else {
		driver = "sqlite"
		dsn = "dev.db"
		log.Printf("Connecting to SQLite (file: dev.db)...")
	}

	sqlDB, err := sql.Open(driver, dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	sqlDB.SetMaxOpenConns(25)
	sqlDB.SetMaxIdleConns(5)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)

	if err := sqlDB.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Printf("Connected successfully using driver: %s", driver)

	db := &DB{
		DB:         sqlDB,
		DriverName: driver,
	}

	if err := db.MigrateAndSeed(cfg); err != nil {
		return nil, fmt.Errorf("migration and seed failed: %w", err)
	}

	return db, nil
}

func (db *DB) MigrateAndSeed(cfg *config.Config) error {
	var createSubmissionsSQL, createAdminsSQL string

	if db.DriverName == "pgx" {
		createSubmissionsSQL = `
		CREATE TABLE IF NOT EXISTS contact_submissions (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			budget TEXT,
			message TEXT NOT NULL,
			source TEXT DEFAULT 'portfolio',
			user_agent TEXT,
			ip_address TEXT,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			email_sent BOOLEAN DEFAULT FALSE,
			email_error TEXT
		);
		CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
			ON contact_submissions (created_at DESC);
		`

		createAdminsSQL = `
		CREATE TABLE IF NOT EXISTS admin_users (
			id TEXT PRIMARY KEY,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		);
		`
	} else {
		// SQLite syntax
		createSubmissionsSQL = `
		CREATE TABLE IF NOT EXISTS contact_submissions (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			email TEXT NOT NULL,
			budget TEXT,
			message TEXT NOT NULL,
			source TEXT DEFAULT 'portfolio',
			user_agent TEXT,
			ip_address TEXT,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			email_sent INTEGER DEFAULT 0,
			email_error TEXT
		);
		CREATE INDEX IF NOT EXISTS contact_submissions_created_at_idx
			ON contact_submissions (created_at DESC);
		`

		createAdminsSQL = `
		CREATE TABLE IF NOT EXISTS admin_users (
			id TEXT PRIMARY KEY,
			email TEXT UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
		`
	}

	if _, err := db.Exec(createSubmissionsSQL); err != nil {
		return fmt.Errorf("error creating contact_submissions table: %w", err)
	}

	if _, err := db.Exec(createAdminsSQL); err != nil {
		return fmt.Errorf("error creating admin_users table: %w", err)
	}

	// Check if admin user exists
	cleanEmail := strings.ToLower(strings.TrimSpace(cfg.AdminEmail))
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM admin_users WHERE LOWER(email) = ?", cleanEmail).Scan(&count)
	if err != nil {
		// PostgreSQL uses $1 instead of ?
		if db.DriverName == "pgx" {
			err = db.QueryRow("SELECT COUNT(*) FROM admin_users WHERE LOWER(email) = $1", cleanEmail).Scan(&count)
		}
		if err != nil {
			return fmt.Errorf("error checking admin_users: %w", err)
		}
	}

	if count == 0 {
		hashedPass, err := bcrypt.GenerateFromPassword([]byte(cfg.AdminPassword), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("failed to hash admin password: %w", err)
		}

		adminID := uuid.New().String()
		now := time.Now().UTC()

		if db.DriverName == "pgx" {
			_, err = db.Exec(
				"INSERT INTO admin_users (id, email, password_hash, created_at) VALUES ($1, $2, $3, $4)",
				adminID, cleanEmail, string(hashedPass), now,
			)
		} else {
			_, err = db.Exec(
				"INSERT INTO admin_users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
				adminID, cleanEmail, string(hashedPass), now,
			)
		}
		if err != nil {
			return fmt.Errorf("failed to seed admin user: %w", err)
		}
		log.Printf("Initialized admin account: %s", cleanEmail)
	}

	return nil
}

