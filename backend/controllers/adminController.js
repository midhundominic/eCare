const DoctorLeave = require('../models/doctorLeaveModel');
const DoctorModel = require('../models/doctorModel');
const CoordinatorModel = require('../models/coordinatorModel');
const PatientModel = require('../models/patientModel');

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



const toggleUserStatus = async (req, res) => {
  const { id, userType } = req.params;
  const { isDisabled } = req.body;

  console.log("id,userType",req.params);
  console.log("Disable",req.body);

  let Model;
  switch (userType) {
    case 'patient':
      Model = PatientModel;
      break;
    case 'doctor':
      Model = DoctorModel;
      break;
    case 'coordinator':
      Model = CoordinatorModel;
      break;
    default:
      return res.status(400).json({ message: 'Invalid user type' });
  }

  try {
    const user = await Model.findByIdAndUpdate(id, { isDisabled }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(201).json({ message: 'User status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const editUserDetails = async (req, res) => {
  const { id, userType } = req.params;
  const updateData = req.body;

  let Model;
  switch (userType) {
    case 'patient':
      Model = PatientModel;
      break;
    case 'doctor':
      Model = DoctorModel;
      break;
    case 'coordinator':
      Model = CoordinatorModel;
      break;
    default:
      return res.status(400).json({ message: 'Invalid user type' });
  }

  try {
    const user = await Model.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(201).json({ message: 'User details updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




const getLeaveRequests = async (req, res) => {
  try {
    const leaveRequests = await DoctorLeave.find().populate("doctorId");
    res.status(201).json({ leaveRequests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave requests", error });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;
    
    const leave = await DoctorLeave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    leave.status = status;
    await leave.save();

    res.status(201).json({ message: "Leave status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating leave status", error });
  }
};


module.exports = {
  adminSignin,
  toggleUserStatus,
  editUserDetails,
  getLeaveRequests,
  updateLeaveStatus,
};
