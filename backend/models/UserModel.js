const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: {type:Number, required: true}
});

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const DoctorSchema = new mongoose.Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  experience: { type: String, required: true},
  gender: { type: String, required: true},
  email: { type: String, required: true},
  phone: { type: String, required: true},
  specialization: { type: String, required: true},
  y_experience:{type: String, required: true},
  password: { type: String, required: true},
  role : { type: Number, required:true},
})

const Patient = mongoose.model('patient_login', PatientSchema);
const Admin = mongoose.model('admin_login', AdminSchema);
const DoctorReg = mongoose.model('doctor_reg',DoctorSchema)

module.exports = { Patient, Admin, DoctorReg };        
