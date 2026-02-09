# Polling Application

A modern, full-stack polling application that allows users to create polls, vote on them, and view real-time results with beautiful visualizations.

## 📋 Project Description

This is a polling application built with a clean separation between frontend and backend. Users can:

- **Browse Active Polls** - View all available polls in a card-based layout
- **Create Polls** - Design custom polls with multiple choice options
- **Vote** - Cast votes on polls with duplicate prevention based on IP address
- **View Results** - See real-time voting results with percentage breakdowns and visual progress bars

The application features a modern UI built with Material-UI, a RESTful API backend, and JSON Server for lightweight data persistence.

## 🛠 Tech Stack

### Backend
- **Node.js** (v18+) - JavaScript runtime environment
- **Express.js** (v5.2.1) - Fast, minimalist web framework
- **JSON Server** (v1.0.0-beta.5) - Full fake REST API for rapid prototyping
- **Axios** (v1.13.5) - Promise-based HTTP client for API calls
- **CORS** (v2.8.6) - Cross-Origin Resource Sharing middleware
- **Nodemon** (v3.1.11) - Dev dependency for auto-restart during development

### Frontend
- **React** (v19.2.0) - UI library for building interactive interfaces
- **Vite** (v7.3.1) - Next-generation frontend build tool
- **Material-UI (MUI)** (v7.3.7) - React component library implementing Material Design
- **React Router** (v7.13.0) - Declarative routing for React applications
- **Axios** (v1.13.5) - HTTP client for API communication
- **Emotion** (v11.14.0) - CSS-in-JS styling solution (MUI dependency)
- **MUI Icons Material** (v7.3.7) - Material Design icons

## 🗄 Database Structure

The application uses JSON Server with a file-based database (`db.json`) containing three main collections:

### Polls Table
```json
{
  "id": "number (auto-increment)",
  "title": "string (poll question)",
  "description": "string (optional context)",
  "createdAt": "ISO 8601 datetime string",
  "totalVotes": "number (aggregate vote count)",
  "isActive": "boolean (poll visibility status)"
}
```

### Options Table
```json
{
  "id": "number (auto-increment)",
  "pollId": "number (foreign key to polls.id)",
  "text": "string (option text)",
  "voteCount": "number (votes for this option)"
}
```

### Votes Table
```json
{
  "id": "number (auto-increment)",
  "pollId": "number (foreign key to polls.id)",
  "optionId": "number (foreign key to options.id)",
  "userIp": "string (voter's IP address)",
  "votedAt": "ISO 8601 datetime string"
}
```

### Relationships
- **One-to-Many**: One Poll has many Options (`polls.id` → `options.pollId`)
- **One-to-Many**: One Poll has many Votes (`polls.id` → `votes.pollId`)
- **One-to-Many**: One Option has many Votes (`options.id` → `votes.optionId`)

## 🚀 Setup Steps

### Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd polling
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

### Running the Application

You need to run **three separate processes** in different terminal windows:

#### Terminal 1: JSON Server (Database)
```bash
cd backend
npm run json-server
```
- Runs on: `http://localhost:4000`
- Database file: `backend/db.json`

#### Terminal 2: Express API Server
```bash
cd backend
npm run dev
```
- Runs on: `http://localhost:3001`
- Auto-restarts on code changes (nodemon)

#### Terminal 3: React Frontend
```bash
cd frontend
npm run dev
```
- Runs on: `http://localhost:5173` (default Vite port)
- Hot Module Replacement (HMR) enabled

### Accessing the Application

- **Frontend UI**: http://localhost:5173
- **Express API**: http://localhost:3001
- **JSON Server**: http://localhost:4000
- **Health Check**: http://localhost:3001/health

### Environment Configuration (Optional)

Create a `.env` file in the `frontend` directory to customize the API URL:

```env
VITE_API_URL=http://localhost:3001
```

## 🔌 API Endpoints

### Base URL: `http://localhost:3001`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/polls` | Get all active polls | - | Array of poll objects |
| `GET` | `/polls/:id` | Get poll details with options | - | Poll object with options array |
| `GET` | `/polls/:id/results` | Get poll results with percentages | - | Results object with vote statistics |
| `POST` | `/polls` | Create a new poll | `{ question, options, description? }` | Created poll with options |
| `POST` | `/polls/:id/vote` | Vote on a poll option | `{ optionId }` | Updated poll with options |
| `DELETE` | `/polls/:id` | Delete a poll | - | Success message |
| `GET` | `/health` | Health check | - | Status message |

### Detailed Endpoint Documentation

#### 1. GET /polls
**Description**: Fetch all active polls (where `isActive = true`)

**Response**: 200 OK
```json
[
  {
    "id": 1,
    "title": "What is your favorite programming language?",
    "description": "Vote for your most preferred programming language",
    "createdAt": "2026-02-09T12:00:00.000Z",
    "totalVotes": 10,
    "isActive": true
  }
]
```

#### 2. GET /polls/:id
**Description**: Get a specific poll with all its options

**Response**: 200 OK
```json
{
  "id": 1,
  "title": "What is your favorite programming language?",
  "description": "Vote for your most preferred programming language",
  "createdAt": "2026-02-09T12:00:00.000Z",
  "totalVotes": 10,
  "isActive": true,
  "options": [
    {
      "id": 1,
      "pollId": 1,
      "text": "JavaScript",
      "voteCount": 4
    }
  ]
}
```

#### 3. GET /polls/:id/results
**Description**: Get poll results with vote counts and calculated percentages

**Response**: 200 OK
```json
{
  "pollId": 1,
  "title": "What is your favorite programming language?",
  "totalVotes": 10,
  "options": [
    {
      "id": 1,
      "text": "JavaScript",
      "voteCount": 4,
      "percentage": "40.00"
    },
    {
      "id": 2,
      "text": "Python",
      "voteCount": 6,
      "percentage": "60.00"
    }
  ]
}
```

#### 4. POST /polls
**Description**: Create a new poll with options

**Request Body**:
```json
{
  "question": "What is your favorite backend framework?",
  "description": "Choose your preferred Node.js framework",
  "options": ["Express.js", "NestJS", "Fastify", "Koa"]
}
```

**Response**: 201 Created
```json
{
  "id": 4,
  "title": "What is your favorite backend framework?",
  "description": "Choose your preferred Node.js framework",
  "createdAt": "2026-02-09T14:30:00.000Z",
  "totalVotes": 0,
  "isActive": true,
  "options": [
    {
      "id": 13,
      "pollId": 4,
      "text": "Express.js",
      "voteCount": 0
    }
  ]
}
```

**Validation**:
- `question` is required (400 Bad Request)
- At least 2 options required (400 Bad Request)

#### 5. POST /polls/:id/vote
**Description**: Submit a vote for a poll option

**Request Body**:
```json
{
  "optionId": 2
}
```

**Response**: 200 OK
```json
{
  "id": 1,
  "title": "What is your favorite programming language?",
  "totalVotes": 11,
  "isActive": true,
  "options": [
    {
      "id": 2,
      "pollId": 1,
      "text": "Python",
      "voteCount": 7
    }
  ]
}
```

**Error Responses**:
- `409 Conflict` - User has already voted on this poll (IP-based duplicate detection)
- `404 Not Found` - Poll or option not found
- `400 Bad Request` - Option doesn't belong to the poll or invalid data

#### 6. DELETE /polls/:id
**Description**: Delete a poll and all associated options and votes

**Response**: 200 OK
```json
{
  "message": "Poll deleted successfully"
}
```

## 📁 Project Structure

```
polling/
├── backend/
│   ├── controllers/
│   │   └── pollController.js      # Request handlers
│   ├── services/
│   │   └── pollService.js         # Business logic & JSON Server integration
│   ├── routes/
│   │   └── pollRoutes.js          # Express route definitions
│   ├── db.json                     # JSON Server database
│   ├── server.js                   # Express server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── PollListPage.jsx   # Browse all active polls
    │   │   ├── PollDetailPage.jsx # Vote on a poll
    │   │   ├── CreatePollPage.jsx # Create new poll
    │   │   └── ResultsPage.jsx    # View poll results
    │   ├── services/
    │   │   └── api.js             # Axios API client
    │   ├── App.jsx                # Root component with routes
    │   └── main.jsx               # React entry point
    ├── package.json
    └── vite.config.js
```

## 🎯 Key Features

### Frontend Features
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Material-UI Components** - Professional, consistent UI using MUI component library
- **Loading States** - CircularProgress indicators during async operations
- **Error Handling** - User-friendly error messages with Alert components
- **Form Validation** - Client-side validation for poll creation and voting
- **Dynamic Form Inputs** - Add/remove poll options dynamically
- **Visual Feedback** - Hover effects, animations, and transitions
- **Progress Bars** - Gradient LinearProgress bars for result visualization
- **Auto-redirect** - Seamless navigation after successful operations

### Backend Features
- **RESTful API** - Standard HTTP methods and status codes
- **Duplicate Vote Prevention** - IP-based voting restriction
- **Aggregate Calculations** - Automatic percentage and total vote calculations
- **Error Handling** - Comprehensive error responses with appropriate status codes
- **CORS Enabled** - Frontend can make cross-origin requests
- **Validation** - Input validation for all POST requests
- **Atomic Operations** - Vote counting and total vote updates happen together

## 🔐 Assumptions & Design Decisions

### 1. **User Authentication**
- **Assumption**: No user authentication is implemented
- **Rationale**: This is a lightweight polling application for rapid prototyping
- **Implication**: Vote prevention relies solely on IP address tracking
- **Future Enhancement**: Could add OAuth, JWT, or session-based authentication

### 2. **Duplicate Vote Prevention**
- **Assumption**: IP addresses are sufficient to identify unique voters
- **Rationale**: Simple implementation without requiring user accounts
- **Limitation**: 
  - Multiple users behind the same NAT/proxy share an IP
  - VPN users can change IPs to vote multiple times
- **Future Enhancement**: Could use browser fingerprinting or require authentication

### 3. **Data Persistence**
- **Assumption**: JSON Server with file-based storage is acceptable
- **Rationale**: Lightweight, no database setup required, good for development
- **Limitation**: Not suitable for production, concurrent write issues possible
- **Future Enhancement**: Migrate to PostgreSQL, MongoDB, or MySQL

### 4. **Poll Deletion**
- **Assumption**: Polls can be deleted via API but not through UI
- **Rationale**: Prevents accidental deletion by end users
- **Access**: Delete endpoint available for admin/developer use
- **Future Enhancement**: Add admin dashboard with delete functionality

### 5. **Real-time Updates**
- **Assumption**: Results require manual refresh
- **Rationale**: Simpler implementation without WebSocket complexity
- **Current Solution**: "Refresh" button on results page
- **Future Enhancement**: Implement WebSocket or Server-Sent Events for live updates

### 6. **Poll Status**
- **Assumption**: Inactive polls (`isActive: false`) are hidden from users
- **Rationale**: Allows poll management without deletion
- **Access**: Status can be modified via JSON Server direct access
- **Use Case**: Archive polls without losing historical data

### 7. **Input Validation**
- **Assumption**: Basic validation is sufficient (non-empty strings, minimum option count)
- **Current Validation**:
  - Question is required
  - Minimum 2 options required
  - Option text cannot be empty
- **Future Enhancement**: Add character limits, profanity filtering, duplicate option detection

### 8. **Vote Recording**
- **Assumption**: All votes are recorded with timestamps and IP addresses
- **Rationale**: Maintains audit trail for potential analytics
- **Data Retention**: No automatic cleanup of vote records
- **Future Enhancement**: Add vote history viewing and analytics dashboard

### 9. **Error Messages**
- **Assumption**: Generic error messages are acceptable for end users
- **Rationale**: Simplifies error handling without exposing internal details
- **Security**: Prevents information leakage about database structure
- **Future Enhancement**: Implement detailed logging and user-friendly error messages

### 10. **Scalability**
- **Assumption**: Low to moderate traffic (hundreds of concurrent users)
- **Current Architecture**: Single server instance with file-based database
- **Limitation**: JSON Server not optimized for high concurrency
- **Future Enhancement**: Add caching (Redis), load balancing, proper database

### 11. **API Rate Limiting**
- **Assumption**: No rate limiting implemented
- **Rationale**: Simplifies development and testing
- **Risk**: Vulnerable to spam/DOS attacks
- **Future Enhancement**: Add express-rate-limit middleware

### 12. **Option Ordering**
- **Assumption**: Options displayed in creation order (by ID)
- **Exception**: Results page sorts by vote count (highest first)
- **Rationale**: Shows most popular options at the top
- **Future Enhancement**: Add randomized option display to reduce position bias

## 🧪 Testing the Application

### Manual Testing with cURL

**Create a poll:**
```bash
curl -X POST http://localhost:3001/polls \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Best database for web apps?",
    "options": ["PostgreSQL", "MongoDB", "MySQL", "SQLite"]
  }'
```

**Vote on a poll:**
```bash
curl -X POST http://localhost:3001/polls/1/vote \
  -H "Content-Type: application/json" \
  -d '{"optionId": 2}'
```

**Get results:**
```bash
curl http://localhost:3001/polls/1/results
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 👤 Author

Built with ❤️ using React, Express, and Material-UI

---

**Note**: This application is designed for development and demonstration purposes. For production use, consider implementing proper authentication, a production-grade database, rate limiting, and security best practices.
