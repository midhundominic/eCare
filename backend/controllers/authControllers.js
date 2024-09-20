// controllers/authControllers.js
const UserModel = require("../models/UserModel"); // Update to your model's path
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    // const existingUser = await UserModel.findOne({ email });
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    // Create a new user
    const newUser = new UserModel({
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

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    //check the user exist
    const patient = await UserModel.findOne({ email });

    if (!patient) {
      return res.status(401).json({ message: "User not found" });
    }

    if (patient.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(201).json({ message: "Login Successsful", data: patient });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

const authWithGoogle = async (req, res) => {
  const { name, email } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      // Create a new user
      user = new UserModel({
        name,
        email,
        password: "", // No password needed for Google sign-in
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

const adminsignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const ADMIN_EMAIL = "admin@ecare.com";
  const ADMIN_PASSWORD = "admin123";

  try {
    if (email != ADMIN_EMAIL) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (ADMIN_PASSWORD !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res
      .status(201)
      .json({ message: "Login Successsful", data: { role: 0 } });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

const registerDoctor = async (req, res) => {
  console.log(req);
  const {
    firstName,
    lastName,
    experience,
    gender,
    email,
    phone,
    specialization,
    y_experience,
    password,
    confirmPassword,
  } = req.body;

  if (password != confirmPassword) {
    return res.status(400).json({ message: "Password do not match" });
  }

  try {
    // const doctorExixts = await UserModel.findOne({ email });
    // if (doctorExixts) {
    //   return res.status(400).json({ message: "Doctor already Exists" });
    // }

    const newDoctor = new UserModel({
      firstName,
      lastName,
      experience,
      gender,
      email,
      phone,
      specialization,
      y_experience,
      password,
      role: 2,
    });

    await newDoctor.save();

    res.status(201).json({ message: "Doctor registered successully" });
  } catch (error) {
    // console.error("Error during doctor registration:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  signup,
  signin,
  authWithGoogle,
  adminsignin,
  registerDoctor,
};
