package email

import (
	"crypto/tls"

	gomail "gopkg.in/gomail.v2"
)

// Emailer saves data to send emails
type Emailer struct {
	User     string
	password string
	Dialer   *gomail.Dialer
}

// NewEmailer makes a new emailer
func NewEmailer(user, pass string) Emailer {
	mailer := gomail.NewDialer("smtp.gmail.com", 465, user, pass)
	mailer.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	return Emailer{
		User:     user,
		password: pass,
		Dialer:   mailer,
	}
}
