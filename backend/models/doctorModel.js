const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  experience: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  y_experience: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true },
});

const Doctor = mongoose.model("doctor", DoctorSchema);

module.exports = Doctor;
