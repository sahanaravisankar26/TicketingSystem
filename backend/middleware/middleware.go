package middleware

import (
	"capella-auth/cors"
	"encoding/json"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("key")

func GenerateJWT(email string) (string, error) {
	claims := jwt.MapClaims{ // This part will just map email to token with expiry
		"email": email,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims) // unsealed part, signed with hs 256 algo
	return token.SignedString(jwtSecret) // This will seal it with secret key and send it so even if on wrong email, it won't work
}

func JwtMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cors.EnableCORS(&w)

		if r.Method == http.MethodOptions {
			return
		}
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		tokenStr := authHeader[len("Bearer "):]

		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		next(w, r)
	}
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(map[string]string{
		"message": "You accessed a protected route",
	})
}
