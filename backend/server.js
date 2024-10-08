const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./Routes/authRoutes");
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api", authRoutes); // Use the routes

app.use('/src/assets/doctorProfile', express.static('src/assets/doctorProfile'));

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
