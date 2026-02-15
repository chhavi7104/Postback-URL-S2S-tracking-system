# Postback-URL-S2S-tracking-system

# S2S Affiliate Postback Tracking System

## System Overview

This is a **Server-to-Server (S2S) Affiliate Postback Tracking System**.  

In affiliate marketing, a **postback** is a server-to-server HTTP request that notifies an affiliate system when a user performs a conversion (e.g., a purchase). Unlike browser-based tracking, S2S postbacks do not rely on cookies and are more reliable.  

**Flow:**

1. User clicks an affiliate link:  
https://affiliate-system.com/click?affiliate_id=1&campaign_id=10&click_id=abc123

csharp
Copy
Edit
→ Stored in the database as a click event.

2. Advertiser reports a conversion via postback:  
https://affiliate-system.com/postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD

pgsql
Copy
Edit
→ Validates the click and stores conversion in the database.

3. Affiliate can view clicks and conversions in a dashboard.

---

## System Structure

Postback-URL-S2S-tracking-system/
│
├── backend/
│ ├── server.js # Node.js + Express backend
│ ├── package.json
│
├── frontend/
│ ├── pages/index.js # Next.js affiliate dashboard
│ ├── styles/
│ │ ├── globals.css
│ │ └── Dashboard.module.css
│ ├── package.json
│
├── database/
│ └── schema.sql # PostgreSQL tables + dummy data
│
└── README.md

yaml
Copy
Edit

---

## Requirements

- Node.js >= 18
- PostgreSQL >= 14
- npm

---

## Setup Instructions

### 1. Database (PostgreSQL)

1. Start PostgreSQL.
2. Create a database:
   ```bash
   psql -U postgres
   CREATE DATABASE affiliate;
   \q
Run schema to create tables and insert dummy data:

bash
Copy
Edit
psql -U postgres -d affiliate -f database/schema.sql
2. Backend Setup
Navigate to backend folder:

bash
Copy
Edit
cd backend
Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
node server.js
Runs on: http://localhost:3001

3. Frontend Setup
Navigate to frontend folder:

bash
Copy
Edit
cd frontend
Install dependencies:

bash
Copy
Edit
npm install
Start the development server:

bash
Copy
Edit
npm run dev
Runs on: http://localhost:3000

Open in browser: http://localhost:3000?affiliate_id=1

Example API Requests
Track Click
http
Copy
Edit
GET /click?affiliate_id=1&campaign_id=10&click_id=abc123
Response:

json
Copy
Edit
{
  "status": "success",
  "message": "Click tracked"
}
Postback Conversion
http
Copy
Edit
GET /postback?affiliate_id=1&click_id=abc123&amount=100&currency=USD
Response (if valid click):

json
Copy
Edit
{
  "status": "success",
  "message": "Conversion tracked"
}
Response (if invalid click):

json
Copy
Edit
{
  "status": "error",
  "message": "Invalid click_id or affiliate_id"
}
Fetch Clicks for Affiliate
http
Copy
Edit
GET /clicks?affiliate_id=1
Fetch Conversions for Affiliate
http
Copy
Edit
GET /conversions?affiliate_id=1
Database Schema (PostgreSQL)
affiliates
Column	Type
id	SERIAL PRIMARY KEY
name	VARCHAR(100) NOT NULL

campaigns
Column	Type
id	SERIAL PRIMARY KEY
name	VARCHAR(100) NOT NULL

clicks
Column	Type
id	SERIAL PRIMARY KEY
affiliate_id	INT REFERENCES affiliates(id)
campaign_id	INT REFERENCES campaigns(id)
click_id	VARCHAR(255) UNIQUE NOT NULL
timestamp	TIMESTAMP DEFAULT NOW()

conversions
Column	Type
id	SERIAL PRIMARY KEY
click_id	VARCHAR(255) REFERENCES clicks(click_id)
amount	FLOAT
currency	VARCHAR(10)
timestamp	TIMESTAMP DEFAULT NOW()

Notes
Ensure backend is running before opening the frontend.

You can change affiliate_id in the URL to view different affiliates:

arduino
Copy
Edit
http://localhost:3000?affiliate_id=2
Frontend is built with Next.js + CSS Modules, backend with Node.js + Express, database is PostgreSQL.
