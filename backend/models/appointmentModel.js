const mongoose = require("mongoose");
const dayjs = require("dayjs");

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
  appointmentDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['scheduled', 'rescheduled', 'canceled'], 
    default: 'scheduled' 
  },
  createdAt: { type: Date, default: () => dayjs().toDate() },
});

const Appointment = mongoose.model('appointment', AppointmentSchema);

module.exports = Appointment;
