# 🌐 REST API — Users & Posts

> **Academic Project** — A Node.js REST API built with Express, available in three versions: in-memory, JSON file persistence, and XML file persistence. Includes a browser-based HTML client to test all endpoints.

---

## ✨ Features

- Full **CRUD** on Users (`GET`, `POST`, `PUT`, `DELETE`)
- **Posts** management linked to users
- **3 server implementations** to compare storage strategies
- **HTML client** to interact with the API directly in the browser
- CORS enabled for cross-origin requests
- Health check endpoint
- Input validation and proper HTTP status codes (200, 201, 400, 404, 500)

---

## 🗂️ Three Server Versions

| File | Storage | Description |
|---|---|---|
| `server.js` | In-memory | Data lost on restart — simplest version |
| `server_json.js` | JSON files | Data persisted in `data/users.json` & `data/posts.json` |
| `server_xml.js` | XML files | Data persisted in `data/users.xml` & `data/posts.xml` via `xml2js` |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime |
| [Express 5](https://expressjs.com/) | HTTP framework |
| [cors](https://www.npmjs.com/package/cors) | Cross-origin resource sharing |
| [xml2js](https://www.npmjs.com/package/xml2js) | XML parsing & serialization |

---

## 📄 API Endpoints

### Users

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `POST` | `/api/users` | Create a new user |
| `PUT` | `/api/users/:id` | Update a user |
| `DELETE` | `/api/users/:id` | Delete a user (also deletes their posts) |

### Posts

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/posts` | Get all posts |
| `GET` | `/api/users/:userId/posts` | Get all posts by a user |
| `POST` | `/api/posts` | Create a new post |

### Other

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |

---

## 📦 Data Models

```json
// User
{ "id": 1, "name": "John Doe", "email": "john@example.com" }

// Post
{ "id": 1, "title": "First Post", "content": "Hello World", "userId": 1 }
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/aissouss/rest-api-express.git
cd rest-api-express

# 2. Install dependencies
npm install
```

### Run the Server

Choose the version you want:

```bash
# In-memory (no persistence)
node server.js

# JSON file persistence
node server_json.js

# XML file persistence
node server_xml.js
```

Server starts at **http://localhost:3000**

### Use the HTML Client

Open `client.html` directly in your browser to test all endpoints with a visual interface — no extra tools needed.

---

## 📁 Project Structure

```
rest-api-express/
├── server.js          # Version 1: in-memory storage
├── server_json.js     # Version 2: JSON file persistence
├── server_xml.js      # Version 3: XML file persistence
├── client.html        # Browser-based API client
├── package.json
└── data/
    ├── users.json
    ├── posts.json
    ├── users.xml
    └── posts.xml
```

---

## 🎓 Academic Context

This project was developed as a Web Services assignment during the L3 Software Engineering program.

**Author:** Aissya Boukraa  
[GitHub](https://github.com/aissouss)

---

## 📄 License

This project is for educational use only.
