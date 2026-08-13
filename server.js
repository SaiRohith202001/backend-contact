const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const contactRoutes = require("./routes/contactRoutes.js");
const propertyRouter = require("./routes/propertyRoutes.js");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middlewares/errorHandler.js");

const app = express();
const PORT = process.env.PORT || 8000;
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-session-secret";
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isLocalOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      (parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname === "::1")
    );
  } catch (error) {
    return false;
  }
};

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (configuredOrigins.includes(origin) || isLocalOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// *******Dont touch above **********

// add your routes here import here, also add here
app.use((req, res, next) => {
  next(); // Passes control to the next middleware or route handler
});
//eg.
//route import

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", port: PORT });
});

app.use("/api/v1", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database is not connected. Set MONGODB_URI to use API routes locally.",
    });
  }

  next();
});

//route declaration
//http://localhost:8000/api/v1/property/add-property
app.use("/api/v1/property", propertyRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/user", userRoutes);

// error handler middleware
app.use(errorHandler);

// *******Dont touch below **********
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✌ server is running on port : ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB Connection Failed !!", error);
  });
