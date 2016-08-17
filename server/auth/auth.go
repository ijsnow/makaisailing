package auth

import (
	jwt "github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

// Hash generates a hash for a given password
func Hash(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	return string(hash), err
}

// ValidatePassword checks to see if password is correct
func ValidatePassword(userHash, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(userHash), []byte(password))
}

// Jwt gets a new token for the user
func Jwt(username string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)

	claims := token.Claims.(jwt.MapClaims)
	claims["name"] = username
	claims["admin"] = true

	// Generate encoded token and send it as response.
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return "", err
	}

	return t, nil
}
