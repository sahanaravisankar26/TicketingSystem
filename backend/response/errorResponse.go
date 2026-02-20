package response

import (
	"encoding/json"
	"net/http"
)

func RespondWithError(w http.ResponseWriter, message string, code int) {
    w.Header().Set("Content-Type", "application/json") // Required for frontend to recognize JSON
	w.WriteHeader(code) // Send the correct error code (400, 401, 500, etc.)
    json.NewEncoder(w).Encode(map[string]string{"error": message}) // Sends {"error": "User not found"}
}