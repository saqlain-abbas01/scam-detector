# 🛡️ Scam Detector Backend

Production-grade Node.js backend API for the Scam Detector application with JWT authentication, MongoDB integration, and comprehensive error handling.

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── src/
│   ├── controllers/
│   │   └── authController.js # Authentication logic (signup, login, logout)
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── models/
│   │   └── User.js           # Mongoose User schema with password hashing
│   ├── routes/
│   │   └── auth.js           # Authentication API routes
│   └── utils/
│       ├── constants.js      # App-wide constants
│       └── jwt.js            # JWT token generation and verification
├── .env                      # Environment variables (don't commit)
├── .env.example              # Example environment variables
├── .gitignore               # Git ignore rules
├── index.js                 # Main server entry point
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone and navigate to backend**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your actual values
# - DATABASE_URL: MongoDB connection string
# - JWT_SECRET: Secret key for JWT (generate a strong random string)
# - CLIENT_URL: Frontend URL for CORS
```

4. **Start the server**

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 🔐 Authentication Flow

### User Registration (Signup)

**POST** `/api/auth/signup`

Request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response (201):

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-04-23T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Security Features:**

- Password hashed with bcryptjs (10 salt rounds)
- Email validation
- Duplicate email prevention
- JWT token generated and set in httpOnly cookie

### User Login

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

Response (200):

```json
{
  "success": true,
  "message": "Login successful",
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Security Features:**

- Password comparison with hashed password
- Last login timestamp updated
- JWT token returned and set in cookie

### User Logout

**POST** `/api/auth/logout`

Headers:

```
Authorization: Bearer <token>
```

Response (200):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

Cookie is cleared on client side.

### Get Current User

**GET** `/api/auth/me`

Headers:

```
Authorization: Bearer <token>
```

Response (200):

```json
{
  "success": true,
  "user": {...}
}
```

## 🔐 Security Features

1. **Password Security**
   - Bcryptjs hashing (10 salt rounds)
   - Minimum 6 characters validation
   - Never returned in API responses

2. **JWT Tokens**
   - HttpOnly cookies (prevent XSS)
   - Secure flag in production
   - 7-day expiration by default
   - Verified on protected routes

3. **Authentication Middleware**
   - Validates JWT tokens
   - Extracts user info from token
   - Returns 403 for invalid/expired tokens

4. **CORS**
   - Restricts requests to configured CLIENT_URL
   - Credentials enabled for cookie sharing

## 📝 Environment Variables

```bash
# Database
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname

# Server
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
```

## 🛠️ API Endpoints

| Method | Endpoint           | Auth | Description       |
| ------ | ------------------ | ---- | ----------------- |
| POST   | `/api/auth/signup` | ❌   | Register new user |
| POST   | `/api/auth/login`  | ❌   | Login user        |
| POST   | `/api/auth/logout` | ✅   | Logout user       |
| GET    | `/api/auth/me`     | ✅   | Get current user  |
| GET    | `/health`          | ❌   | Health check      |

## 🧪 Testing with cURL

### Signup

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Pass123"}'
```

### Get Current User

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT generation and verification
- **cookie-parser**: Cookie middleware
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

## 🚨 Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common error codes:

- **400**: Bad Request (missing/invalid fields)
- **401**: Unauthorized (invalid credentials)
- **403**: Forbidden (invalid/expired token)
- **404**: Not Found
- **409**: Conflict (user already exists)
- **500**: Internal Server Error

## 🔄 Frontend Integration

Frontend calls should:

1. Send credentials to signup/login endpoints
2. Store JWT token from response
3. Include token in Authorization header for protected routes
4. Handle cookie-based auth for seamless experience

Example frontend call:

```javascript
const response = await fetch("http://localhost:3000/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include", // Important for cookie
  body: JSON.stringify({ email, password }),
});
```

## 📚 Additional Notes

- Passwords are never logged or exposed in responses
- Database timestamps (`createdAt`, `updatedAt`) tracked automatically
- User schema validates email format
- All dates are in ISO 8601 format
- Production deployment should use HTTPS and strong JWT_SECRET

## 🤝 Contributing

Follow these conventions:

- Use async/await for asynchronous operations
- Handle errors with try/catch
- Return consistent JSON responses
- Add proper validation before database operations
- Use meaningful HTTP status codes

## 📄 License

ISC
