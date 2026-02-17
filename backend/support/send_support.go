package support

import (
    "encoding/json"
    "net/http"
    "capella-auth/cors"
    "log"

    "github.com/couchbase/gocb/v2"
)

type Issue struct {
    Id string `json:"id"`
    Email string `json:"email"`
    Issue string `json:"issue"`
    Description string `json:"description"`
    Message string `json:"message"`
    State string `json:"state"`
}

func SendSupport(collection *gocb.Collection, broker *Broker) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        cors.EnableCORS(&w)
        w.Header().Set("Content-Type", "application/json")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        if r.Method != http.MethodPost {
            w.WriteHeader(http.StatusMethodNotAllowed)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Method not allowed",
            })
            return
        }

        var issue Issue
        err := json.NewDecoder(r.Body).Decode(&issue)
        if err != nil {
            log.Printf("Error decoding request body: %v", err)
            w.WriteHeader(http.StatusBadRequest)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Invalid request body",
            })
            return
        }

        // Validate required fields
        if issue.Id == "" || issue.Email == "" || issue.Issue == "" || issue.Description == "" || issue.State == "" {
            w.WriteHeader(http.StatusBadRequest)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "All fields are required",
            })
            return
        }

        // log.Printf("Attempting to save issue: ID=%s, Email=%s", issue.Id, issue.Email)

        _, err = collection.Upsert(issue.Id, issue, nil) // change to insert
        if err != nil {
            log.Printf("Error saving to database: %v", err)
            w.WriteHeader(http.StatusInternalServerError)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Cannot submit. Maybe re-try?",
            })
            return
        }

        // log.Printf("Issue saved successfully: ID=%s", issue.Id)

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{
            "message": "Your issue has been successfully submitted. Stay tuned for updates!",
        })
        broker.Broadcast("CREATE", issue)
    }
}