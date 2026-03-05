# Ticketing System

A real-time support ticketing application with role-based access, JWT authentication, and instant updates using Server-Sent Events (SSE). Built for scalable, secure, and responsive issue management.

---

## Features

- **User Authentication:** Sign-up and login with JWT-based stateless authentication (24-hour validity).
- **Role-Based Access:** Separate dashboards and permissions for users and admins.
- **Issue Management:** Users can submit, edit, delete, and view their issue history.
- **Admin Controls:** Admins can view all issues and resolve them, with resolution updates sent to users.
- **Real-Time Updates:** Instant ticket updates for users and admins via SSE and broker mechanism—no manual refresh required.
- **Help & Documentation:** Accessible help resources for users.
- **Secure Logout:** End user sessions securely.

---

## Technical Architecture

- **Frontend:**  
  - React + TypeScript SPA  
  - Styled with Tailwind CSS  
  - Communicates with backend via REST and SSE

- **Backend:**  
  - Go server  
  - RESTful APIs for authentication and ticket management  
  - SSE endpoints for real-time updates  
  - In-memory broker for event distribution

- **Database:**  
  - Couchbase Capella (NoSQL)  
  - Stores user credentials, roles, and tickets

- **Authentication:**  
  - JWT tokens for stateless, secure sessions  
  - Role-based access control enforced on both frontend and backend

- **Event Streaming:**  
  - Server-Sent Events (SSE) for real-time communication  
  - Broker pattern for managing connections and broadcasting updates

---

## Workflow

1. **Sign-Up:**  
   - User registers; data stored in Capella.
2. **Login:**  
   - Credentials validated; JWT issued.
3. **Role-Based Routing:**  
   - User redirected to User Dashboard; Admin to Admin Dashboard.
4. **Issue Submission:**  
   - User submits issue; timestamp-based ID generated; stored in Capella.
5. **Issue Management:**  
   - Users can edit/delete/view issues.
   - Admins can view/resolve all issues.
6. **Real-Time Updates:**  
   - Broker pushes updates to all connected clients via SSE.
   - No manual refresh needed.

---

## Design Decisions

- **JWT Authentication:** Stateless, scalable, secure.
- **Broker Pattern:** Decouples event management, future-proofs for scaling.
- **SSE over Polling:** Efficient, low-latency real-time updates.
- **Timestamp IDs:** Simple, unique, and sortable.
- **Couchbase Capella:** Managed, scalable NoSQL database.

---

## Setup & Running

### Prerequisites

- Go (>=1.18)
- Node.js (>=16)
- Couchbase Capella account

### Backend

```bash
cd backend
go mod tidy
go run main.go
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Configuration

- Set Couchbase Capella credentials in backend config.
- Update frontend API endpoints if needed.

---

## Scaling & Production

- For single-server deployments, the in-memory broker is sufficient.
- For horizontal scaling, refactor broker to use Redis Pub/Sub or similar distributed message broker.
