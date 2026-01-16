# Smart Reconciliator Backend

Backend API for the Smart Reconciliator application, built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your `.env` file:**
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB Atlas connection string
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-reconciliator?retryWrites=true&w=majority
   
   # Generate a secure JWT secret (use: openssl rand -base64 64)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Frontend URL(s)
   ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
   ```

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user with a password
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and update `MONGODB_URI` in `.env`

### Running the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` by default.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── config.ts          # Environment configuration
│   │   └── database.ts        # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.ts       # Authentication logic
│   │   └── reconciliation.controller.ts # Reconciliation logic
│   ├── middleware/
│   │   ├── auth.middleware.ts # JWT authentication
│   │   └── error.middleware.ts # Error handling
│   ├── models/
│   │   ├── User.model.ts      # User schema
│   │   └── Reconciliation.model.ts # Reconciliation schema
│   ├── routes/
│   │   ├── auth.routes.ts     # Auth endpoints
│   │   └── reconciliation.routes.ts # Reconciliation endpoints
│   └── server.ts              # Express app entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json
└── tsconfig.json
```

## 🛠️ API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Reconciliations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reconciliations` | Save reconciliation | Yes |
| GET | `/api/reconciliations` | Get user's history | Yes |
| GET | `/api/reconciliations/:id` | Get specific reconciliation | Yes |
| DELETE | `/api/reconciliations/:id` | Delete reconciliation | Yes |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health status |

## 🔒 Security Features

- **Password Hashing:** bcrypt with salt rounds
- **JWT Authentication:** Secure token-based auth
- **CORS Protection:** Configurable allowed origins
- **Helmet:** Security headers
- **Input Validation:** Request validation
- **Error Handling:** Centralized error responses

## 🚢 Deployment

### Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add environment variables in Railway dashboard
5. Deploy: `railway up`

### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables in Render dashboard

### Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables: `heroku config:set MONGODB_URI=...`
5. Deploy: `git subtree push --prefix backend heroku main`

## 🧪 Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:5000/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | 7d |
| `ALLOWED_ORIGINS` | CORS allowed origins | localhost:5173 |

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Verify your connection string is correct
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user credentials are correct

**CORS Error:**
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

**JWT Error:**
- Ensure `JWT_SECRET` is set in `.env`
- Check if token is being sent in Authorization header

## 📄 License

MIT
