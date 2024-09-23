const PatientModel = require("../models/patientModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists
    const existingUser = await PatientModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new PatientModel({
      name,
      email,
      password, // Password will be hashed in the pre-save hook
      role: 1,
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully",
      data: { name: newUser.name, email: newUser.email, role: newUser.role },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for the patient
    const patient = await PatientModel.findOne({ email });
    if (patient) {
      const isMatch = await bcrypt.compare(password, patient.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { userId: patient._id, email: patient.email, role: patient.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login Successful",
        data: { email: patient.email, role: patient.role, name: patient.name },
        token,
      });
    }

    // If no user found
    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const authWithGoogle = async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await PatientModel.findOne({ email });
    if (!user) {
      // Create a new user with empty password for Google users
      user = new PatientModel({
        name,
        email,
        password: "",
        role: 1,
      });

      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      data: user,
      token,
      message: "User login successful!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllPatient = async (req, res) => {
  try {
    const patients = await PatientModel.find({});
    res.status(200).json({ data: patients });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  signup,
  signin,
  authWithGoogle,
  getAllPatient,
};
