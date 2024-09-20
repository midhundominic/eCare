const DoctorModel = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerDoctor = async (req, res) => {
  console.log(req.body, '1111111111');
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
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !experience ||
    !gender ||
    !email ||
    !phone ||
    !specialization ||
    !y_experience ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const doctorExixts = await DoctorModel.findOne({ email });
    if (doctorExixts) {
      return res.status(400).json({ message: "Doctor already Exists" });
    }

    const newDoctor = new DoctorModel({
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
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      
      const doctor = await doctorModel.findOne({ email });
  
      if (!doctor) {
        return res.status(401).json({ message: "User not found" });
      }
  
      if (doctor.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.status(201).json({
        message: "Login Successsful",
        data: { email: doctor.email, role: doctor.role, name: doctor.name },
      });
    } catch (error) {
      res.status(500).json({ message: "server error" });
    }
  };

module.exports = {
  registerDoctor,signin
};
