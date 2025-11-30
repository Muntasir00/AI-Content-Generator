# AI-Powered Content Generator (MERN + Redis Queue)

This is a full-stack content generator with:

- Authentication (JWT)
- AI integration (OpenAI API)
- Redis Queue with 60-second delayed AI execution
- MongoDB content storage
- Status polling UI

---

## 🔧 Tech Stack

Frontend: React-Router dev
Backend: Node.js, Express  
Database: MongoDB (Mongoose)  
Queue System: Redis + BullMQ  
AI Provider: OpenAI GPT-4o mini

---

## ▶ Run Locally

### Backend

cd backend
npm i
npm run dev

Start Redis:

redis-server

Run worker:

node worker.js

### Frontend

cd frontend
npm install
npm run dev

---

## 🌐 API Endpoints

### Auth

| Method | Endpoint                     | Desc              |
| ------ | ---------------------------- | ----------------- |
| POST   | /user/register               | Register user     |
| POST   | /user/verify                 | Verify Email.     |
| POST   | /user/login                  | Login and get JWT |
| POST   | /user/logout                 | Logout            |
| POST   | /user/forgot-password        | Forgot Password   |
| POST   | /user/verify-otp/:email      | verify otp        |
| POST   | /user/change-password/:email | change password.  |

### Content Queue API

| Method | Endpoint         | Desc                         |
| ------ | ---------------- | ---------------------------- |
| POST   | /app/generate    | Queue AI job (returns jobId) |
| GET    | /app/job//:jobId | Check job status             |
| GET    | /app/id/:Id      | get a job details            |
| GET    | /app             | List all jobs                |
| Delete | /app/id/:Id      | Delete a job                 |

---

## 🧠 How Auth Works

1. User signup with username , email and password and get a email for verifying
2. By clicking the link on email email got verified
3. User signup with their email and password

4. If a user forgot his/her password click on for forgot password on the signin page
5. by providing email he/she will get a 6 digit otp
6. After filling otp he will redirect to change password page and by providing new password and confirm password he will redirect to login page and can login with new password

---

## 🧠 How Queue Works

1. User submits prompt with typw → job queued
2. Quick API response with jobId
3. Worker waits 60 sec → processes AI
4. Saves content to MongoDB
5. UI polls `/status/:jobId` until completed
6. he will see a list of previous all jobs,can view and delete it (Forbidden error is returned if trying to delete another user's job.)

---
