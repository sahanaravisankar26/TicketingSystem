package main

import (
	"capella-auth/constants"
	"capella-auth/kafka"
	"capella-auth/middleware"
	"capella-auth/signin"
	"capella-auth/support"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/couchbase/gocb/v2"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, using system environment variables")
	}

	// CONNECT TO CAPELLA
	connectionString := os.Getenv("CONNECTION_STRING")
	username := os.Getenv("CB_BUCKETNAME")
	password := os.Getenv("CB_BUCKETPASSWORD")

	if connectionString == "" || username == "" || password == "" {
		log.Fatal("Missing required environment variables. Check CONNECTION_STRING, CB_BUCKETNAME, and CB_BUCKETPASSWORD")
	}

	cluster, err := gocb.Connect(connectionString, gocb.ClusterOptions{
		Authenticator: gocb.PasswordAuthenticator{
			Username: username,
			Password: password,
		},
	})

	if err != nil {
		log.Fatal("Connection failed:", err)
	}

	user_bucket := cluster.Bucket("users")
	if err = user_bucket.WaitUntilReady(30*time.Second, nil); err != nil {
		log.Fatal("Users bucket error:", err)
	}

	ticket_bucket := cluster.Bucket("tickets")
	if err = ticket_bucket.WaitUntilReady(30*time.Second, nil); err != nil {
		log.Fatal("Tickets bucket error:", err)
	}

	fmt.Println("Connected successfully!")

	user_collection := user_bucket.DefaultCollection()
	ticket_collection := ticket_bucket.DefaultCollection()
	fmt.Println("Collections made")

	r := mux.NewRouter()
	var ticketBroker *support.Broker = support.NewBroker()

	kafkaProducer, err := kafka.NewProducer("localhost:9092", "ticket-events")
	if err != nil {
		log.Fatal(err)
	}
	kafkaConsumer, err := kafka.NewConsumer("localhost:9092", "ticket-group", "ticket-events")
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	go kafkaConsumer.Start(ctx, func(msg []byte) {
		var event constants.TicketEvent
		json.Unmarshal(msg, &event)
		ticketBroker.Broadcast(event.Action, event.Ticket)
		ticketBroker.NotifyUser(event.Ticket.Email, event.Action, event.Ticket)
	})

	// SIGNUP
	r.HandleFunc("/signup", signin.SignupHandler(user_collection))

	// LOGIN
	r.HandleFunc("/login", signin.LoginHandler(user_collection))

	// PROTECTED ROUTE
	r.HandleFunc("/protected", middleware.JwtMiddleware(middleware.ProtectedHandler))

	// SUPPORT ISSUE
	r.HandleFunc("/submit-issue", middleware.JwtMiddleware(support.SendSupport(ticket_collection, kafkaProducer)))

	// FETCH SUPPORT ISSUES
	r.HandleFunc("/fetch-history", middleware.JwtMiddleware(support.FetchSupport(ticket_collection, cluster, ticketBroker)))
	// r.HandleFunc("/fetch-all-tickets", support.FetchAllSupport(ticket_collection, cluster))
	r.HandleFunc("/fetch-all-tickets", ticketBroker.ServeAdminSSE(cluster))

	// DELETE SUPPORT ISSUE
	r.HandleFunc("/delete-support", middleware.JwtMiddleware(support.DeleteSupport(ticket_collection, kafkaProducer)))

	// UPDATE SUPPORT ISSUE
	r.HandleFunc("/update-support", middleware.JwtMiddleware(support.UpdateSupport(ticket_collection, cluster, kafkaProducer)))
	r.HandleFunc("/admin-updates", support.UpdatedByAdmin(ticket_collection, cluster, kafkaProducer))

	fmt.Println("Server starting on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
