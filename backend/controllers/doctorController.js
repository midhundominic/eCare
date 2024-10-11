const DoctorModel = require("../models/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerDoctor = async (req, res) => {
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

const getAllDoctors = async (req, res) => {
  try {
    const doctor = await DoctorModel.find({});
    res.status(201).json({ data: doctor });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await DoctorModel.findById(req.params.id); // Fetch doctor by ID
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  
  try {
    const doctor = await DoctorModel.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(201).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  deleteDoctor,
};
