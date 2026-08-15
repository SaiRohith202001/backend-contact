# To-Let-Globe Backend

A Node.js + Express backend server for the To-Let-Globe property rental platform. Provides RESTful APIs for user authentication, property listings, reviews, blogs, and contact management.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication**: Registration, login, JWT-based authentication
- **Property Management**: Create, read, update, delete property listings
- **Reviews System**: Users can review properties
- **Blog Platform**: Create and manage blog posts
- **Contact Management**: Contact form submissions and inquiries
- **Role-Based Access**: Admin and user role management
- **File Upload**: Image upload for properties and blogs
- **Local Development**: MongoDB optional—server starts even without database
- **CORS Support**: Configured for localhost development

## 🔧 Prerequisites

- **Node.js**: v14+ (recommend v16 or v18)
- **MongoDB**: v5.0+ (optional for development—server starts without it)
- **npm**: v6+ or yarn
- **Windows/Mac/Linux**: OS-independent

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SaiRohith202001/backend-contact.git
cd backend-contact
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter issues with `nodemon`, install it globally:

```bash
npm install -g nodemon
```

### 3. Verify Installation

```bash
npm list
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root (copy from `.env.sample`):

```bash
cp .env.sample .env
```

Edit `.env` with your local settings:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/tolet_globe

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Authentication
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here

# Email (for contact form)
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Client URL (for password reset links)
CLIENT_URL=http://localhost:5173
```

### Key Notes

- **MONGODB_URI**: Must point to a running MongoDB instance. If missing or invalid, server starts without database but APIs return 503.
- **JWT_SECRET**: Use a strong random string for production
- **CORS_ORIGIN**: Add your frontend URL here for CORS to work
- **EMAIL**: Configure only if using contact form email notifications

## 🚀 Running the Server

### Development Mode (with auto-reload)

```bash
npm start
```

or

```bash
npm run dev
```

**Expected Output**:

```
Server running on http://localhost:8000
Database connected to mongodb://127.0.0.1:27017/tolet_globe
```

Or if MongoDB is not available:

```
Server running on http://localhost:8000
⚠️  MongoDB connection not available. APIs will return 503 Service Unavailable.
```

### Production Mode

```bash
npm run build
npm run start:prod
```

### Health Check

Test if server is running:

```bash
curl http://localhost:8000/health
```

**Expected Response**:

```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-15T12:00:00Z"
}
```

## 📁 Project Structure

```
backend-contact/
├── config/
│   ├── db.js                 # MongoDB connection setup
│   └── env.js                # Environment variable validation
├── controllers/
│   ├── authController.js     # User login, registration, JWT
│   ├── propertyController.js # Property CRUD operations
│   ├── reviewController.js   # Property reviews
│   ├── blogController.js     # Blog posts
│   ├── contactController.js  # Contact form submissions
│   └── userController.js     # User profile management
├── routes/
│   ├── authRoutes.js         # /api/v1/auth/* endpoints
│   ├── propertyRoutes.js     # /api/v1/properties/* endpoints
│   ├── reviewRoutes.js       # /api/v1/reviews/* endpoints
│   ├── blogRoutes.js         # /api/v1/blogs/* endpoints
│   ├── contactRoutes.js      # /api/v1/contact/* endpoints
│   └── userRoutes.js         # /api/v1/users/* endpoints
├── models/
│   ├── userModel.js          # User schema (email, password, role)
│   ├── propertyModel.js      # Property schema (rent, BHK, location, etc.)
│   ├── reviewModel.js        # Review schema (rating, comment, user, property)
│   ├── blogModel.js          # Blog schema (title, content, author)
│   └── contactModel.js       # Contact schema (name, email, message)
├── middlewares/
│   ├── authMiddleware.js     # JWT verification
│   ├── roleMiddleware.js     # Admin/user role checks
│   ├── errorHandler.js       # Global error handling
│   └── multer.js             # File upload configuration
├── utils/
│   └── constants.js          # Application constants
├── public/                   # Static files
├── .env.sample              # Environment template
├── .env                     # Local environment (git-ignored)
├── .gitignore               # Git ignore patterns
├── package.json             # Dependencies and scripts
└── server.js                # Express app setup and middleware

```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Register new user | None |
| POST | `/api/v1/auth/login` | Login user | None |
| POST | `/api/v1/auth/logout` | Logout user | JWT |
| POST | `/api/v1/auth/refresh-token` | Refresh JWT | JWT |
| POST | `/api/v1/auth/forgot-password` | Send reset email | None |
| POST | `/api/v1/auth/reset-password` | Reset password | None |

### Properties

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/properties` | List all properties | None |
| GET | `/api/v1/properties/:id` | Get property details | None |
| POST | `/api/v1/properties` | Create property | JWT |
| PUT | `/api/v1/properties/:id` | Update property | JWT (owner) |
| DELETE | `/api/v1/properties/:id` | Delete property | JWT (owner/admin) |

### Reviews

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/reviews` | List reviews | None |
| GET | `/api/v1/reviews/:propertyId` | Get property reviews | None |
| POST | `/api/v1/reviews` | Create review | JWT |
| DELETE | `/api/v1/reviews/:id` | Delete review | JWT (owner/admin) |

### Blogs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/blogs` | List all blogs | None |
| GET | `/api/v1/blogs/:id` | Get blog details | None |
| POST | `/api/v1/blogs` | Create blog | JWT (admin) |
| PUT | `/api/v1/blogs/:id` | Update blog | JWT (author/admin) |
| DELETE | `/api/v1/blogs/:id` | Delete blog | JWT (author/admin) |

### Contact

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/contact` | Submit contact form | None |
| GET | `/api/v1/contact` | List contact messages | JWT (admin) |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/users/profile` | Get current user profile | JWT |
| PUT | `/api/v1/users/profile` | Update profile | JWT |
| GET | `/api/v1/users/:id` | Get user by ID | None |

## 📊 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  fullName: String,
  phone: String,
  avatar: String (URL),
  role: String (user/admin),
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Properties Collection

```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  rent: Number,
  deposit: Number,
  bhk: Number,
  area: Number,
  locality: String,
  city: String,
  latitude: Number,
  longitude: Number,
  amenities: [String],
  bachelors: String (Allowed/Not Allowed/Only Males/Only Females),
  pets: Boolean,
  images: [String] (URLs),
  userId: ObjectId (ref: User),
  reviews: [ObjectId] (ref: Review),
  createdAt: Date,
  updatedAt: Date
}
```

### Reviews Collection

```javascript
{
  _id: ObjectId,
  rating: Number (1-5),
  comment: String,
  userId: ObjectId (ref: User),
  propertyId: ObjectId (ref: Property),
  createdAt: Date,
  updatedAt: Date
}
```

### Blogs Collection

```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  author: String,
  image: String (URL),
  category: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Contacts Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  message: String,
  createdAt: Date,
  status: String (new/replied/resolved)
}
```

## 🛠️ Troubleshooting

### Issue: Server crashes on startup

**Problem**: `MongooseError: Cannot connect to MongoDB`

**Solution**:
1. Check MongoDB is running: `mongod --version`
2. Verify MONGODB_URI in `.env` is correct
3. Server will start without DB (APIs return 503)

### Issue: CORS error when calling from frontend

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Add frontend URL to CORS_ORIGIN in `.env`
2. Ensure frontend URL matches exactly (http vs https, port number)
3. Example: `CORS_ORIGIN=http://localhost:5173,http://localhost:3000`

### Issue: 503 Service Unavailable from API

**Problem**: All API calls return 503

**Solution**:
1. Check MongoDB connection: Visit http://localhost:8000/health
2. Start MongoDB: `mongod` (on Windows: run MongoDB service)
3. Verify MONGODB_URI: Check `.env` file

### Issue: JWT errors on protected routes

**Problem**: `Unauthorized: Invalid token`

**Solution**:
1. Login first: POST `/api/v1/auth/login`
2. Copy token from response
3. Add to request header: `Authorization: Bearer <token>`

### Issue: File upload fails

**Problem**: `File upload error` or multer errors

**Solution**:
1. Check `public/` folder exists and is writable
2. Verify file size is under 5MB (default multer limit)
3. Allowed formats: .jpg, .png, .gif

### Issue: Port 8000 already in use

**Problem**: `Error: listen EADDRINUSE`

**Solution**:
```bash
# Find process using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill process (get PID from above)
kill <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or change PORT in .env to 8001, 8002, etc.
```

## 📝 Development Tips

### Nodemon Auto-Reload

Server auto-reloads on file changes in development mode:
- Watches: `*.js` in root and subfolders
- Ignores: `node_modules/`, `.env`
- Trigger: Save any file to restart server

### Testing Endpoints

Use Postman, Insomnia, or curl:

```bash
# Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get properties
curl http://localhost:8000/api/v1/properties
```

### Debugging

Enable verbose logging:

```bash
DEBUG=* npm start
```

### Database Inspection

Connect to MongoDB locally:

```bash
mongosh
use tolet_globe
db.properties.find().pretty()
db.users.find().pretty()
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with descriptive message: `git commit -m "feat: add new feature"`
4. Push to your fork: `git push origin feature/your-feature`
5. Create Pull Request with details

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Support

For issues or questions:
- Create an issue on GitHub
- Contact: support@toletglobe.com
- Discord: [Link to community server]
