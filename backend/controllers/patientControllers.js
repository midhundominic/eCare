const PatientModel = require("../models/patientModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await PatientModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new PatientModel({
      name,
      email,
      password,
      role: 1,
    });

    // Save the user
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const authWithGoogle = async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await PatientModel.findOne({ email });
    if (!user) {
      // Create a new user
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
      { email: user.email, id: user._id },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
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
    const patient = await PatientModel.find({});
    res.status(201).json({ data: patient });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  signup,
  authWithGoogle,
  getAllPatient,
};
