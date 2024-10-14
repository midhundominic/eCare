const DoctorModel = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const DoctorLeave = require("../models/doctorLeaveModel");
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
    aboutDoctor,
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
    !password ||
    !aboutDoctor
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
      aboutDoctor,
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

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    // Fetch appointments based on doctorId
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient')  // Optional: Populate patient details
      .populate('doctor');  // Optional: Populate doctor details

    res.status(201).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

const getAppointmentsByDoctorId = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const appointments = await Appointment.find({ doctorId }).populate(
      "patientId",
      "name"
    );
    res.status(201).json({ appointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Leave 
const applyForLeave = async (req, res) => {
  try {
    const { leaveDate, reason } = req.body;
    const { doctorId } = req.params;  // Get doctorId from route params

    const leaveExists = await DoctorLeave.findOne({ doctorId, leaveDate });
    if (leaveExists) {
      return res.status(400).json({ message: "Leave already applied for this date" });
    }

    const newLeave = new DoctorLeave({ doctorId, leaveDate, reason });
    await newLeave.save();

    res.status(201).json({ message: "Leave request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error applying for leave", error });
  }
};

const getLeaveStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const leaveRequest = await DoctorLeave.findOne({ doctorId }).sort({ requestDate: -1 }); // Get the latest leave request
    if (!leaveRequest) {
      return res.status(404).json({ message: "No leave request found" });
    }

    res.status(201).json({ status: leaveRequest.status });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave status", error });
  }
};

module.exports = {
  registerDoctor,
  getAllDoctors,
  getDoctorById,
  deleteDoctor,
  getDoctorAppointments,
  getAppointmentsByDoctorId,
  applyForLeave,
  getLeaveStatus,
};
