const DoctorLeave = require('../models/doctorLeaveModel');
const Doctor = require('../models/doctorLeaveModel');

const adminSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const ADMIN_EMAIL = "admin@ecare.com";
  const ADMIN_PASSWORD = "admin123";

  try {
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (ADMIN_PASSWORD !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(201).json({
      message: "Login Successful",
      data: { role: 0, name: "Admin", email: ADMIN_EMAIL },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await DoctorLeave.find().populate("doctorId", "firstName lastName specialization");
    res.status(201).json({ leaveRequests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests", error });
  }
};

// Approve or reject a leave request
const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;
    console.log(req.body);
    const leave = await DoctorLeave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = status;
    await leave.save();

    res.status(201).json({ message: `Leave ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status", error });
  }
};


module.exports = {
  adminSignin,
  getLeaveRequests,
  updateLeaveStatus,
};
