const PatientModel = require("../models/patientModel");
const DoctorModel = require("../models/doctorModel");
const CoordinatorModel = require("../models/coordinatorModel");


const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const patient = await PatientModel.findOne({ email });

    if (patient) {
      if (patient.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.status(201).json({
        message: "Login Successsful",
        data: { email: patient.email, role: patient.role, name: patient.name },
      });
    }
    const doctor = await DoctorModel.findOne({ email });

    if (doctor) {
      if (doctor.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.status(201).json({
        message: "Login Successsful",
        data: { email: doctor.email, role: doctor.role, name: doctor.name },
      });
    }

    const coordinator = await CoordinatorModel.findOne({ email });

    if (coordinator) {
      if (coordinator.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
      res.status(201).json({
        message: "Login Successsful",
        data: { email: coordinator.email, role: coordinator.role, name: coordinator.name },
      });
    }

  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { signin };
