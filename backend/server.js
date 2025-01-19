const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
const healthDataRoutes = require("./Routes/healthDataRoutes");
require('dotenv').config();
const sessionMiddleware = require('./middleware/session');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(sessionMiddleware);

// Middleware
app.use(express.json( { limit: "50mb" } )); // Parse JSON bodies
app.use(express.urlencoded( { extended :true ,limit:"50mb"} ));

// Routes
app.use("/api", authRoutes); // Use the routes
// app.use('/api/appointments', appointmentRoutes);
// app.use("/healthData",healthDataRoutes);

app.use('/src/assets/doctorProfile', express.static('src/assets/doctorProfile'));
app.use('/src/assets', express.static('src/assets'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
