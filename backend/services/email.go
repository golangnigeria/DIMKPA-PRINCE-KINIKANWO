package services

import (
	"crypto/tls"
	"fmt"
	"log"
	"net/smtp"
	"strconv"

	"portfolio-backend/config"
)

type EmailService struct {
	cfg *config.Config
}

func NewEmailService(cfg *config.Config) *EmailService {
	return &EmailService{cfg: cfg}
}

func (s *EmailService) IsConfigured() bool {
	return s.cfg.SMTPHost != "" && s.cfg.SMTPUser != "" && s.cfg.SMTPPass != ""
}

func (s *EmailService) SendNotification(name, senderEmail, budget, message string) error {
	if !s.IsConfigured() {
		return nil
	}

	port, err := strconv.Atoi(s.cfg.SMTPPort)
	if err != nil {
		port = 465
	}

	addr := fmt.Sprintf("%s:%d", s.cfg.SMTPHost, port)
	auth := smtp.PlainAuth("", s.cfg.SMTPUser, s.cfg.SMTPPass, s.cfg.SMTPHost)

	recipient := s.cfg.ContactRecipientEmail
	if recipient == "" {
		recipient = s.cfg.SMTPUser
	}

	subject := fmt.Sprintf("New portfolio message from %s", name)
	body := fmt.Sprintf("From: %s <%s>\r\n", name, senderEmail)
	if budget != "" {
		body += fmt.Sprintf("Budget: %s\r\n", budget)
	}
	body += fmt.Sprintf("\r\nMessage:\r\n%s\r\n", message)

	msg := []byte(fmt.Sprintf("To: %s\r\nSubject: %s\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s", recipient, subject, body))

	if port == 465 {
		tlsConfig := &tls.Config{
			ServerName: s.cfg.SMTPHost,
		}
		conn, err := tls.Dial("tcp", addr, tlsConfig)
		if err != nil {
			return fmt.Errorf("tls dial failed: %w", err)
		}
		defer conn.Close()

		client, err := smtp.NewClient(conn, s.cfg.SMTPHost)
		if err != nil {
			return fmt.Errorf("smtp client error: %w", err)
		}
		defer client.Close()

		if err = client.Auth(auth); err != nil {
			return fmt.Errorf("smtp auth failed: %w", err)
		}
		if err = client.Mail(s.cfg.SMTPUser); err != nil {
			return err
		}
		if err = client.Rcpt(recipient); err != nil {
			return err
		}
		w, err := client.Data()
		if err != nil {
			return err
		}
		_, err = w.Write(msg)
		if err != nil {
			return err
		}
		err = w.Close()
		if err != nil {
			return err
		}
		return client.Quit()
	}

	return smtp.SendMail(addr, auth, s.cfg.SMTPUser, []string{recipient}, msg)
}

func (s *EmailService) AsyncNotify(name, senderEmail, budget, message string, onResult func(sent bool, errStr string)) {
	if !s.IsConfigured() {
		if onResult != nil {
			onResult(false, "SMTP not configured")
		}
		return
	}

	go func() {
		err := s.SendNotification(name, senderEmail, budget, message)
		if err != nil {
			log.Printf("Email send failed: %v", err)
			if onResult != nil {
				onResult(false, err.Error())
			}
		} else {
			if onResult != nil {
				onResult(true, "")
			}
		}
	}()
}

