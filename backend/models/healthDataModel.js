const mongoose = require("mongoose");

const HealthDataSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "patient", 
    required: true 
  },
  coordinatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "coordinator", 
    required: true 
  },
  bloodPressure: {
    systolic: { type: Number },
    diastolic: { type: Number },
  },
  bloodSugar: { type: Number }, // mg/dL
  cholesterol: { type: Number }, // mg/dL
  thyroid: { type: Number }, // TSH level (µIU/mL)
  heartRate: { type: Number }, // bpm
  oxygenLevel: { type: Number }, // SpO2 (%)
  weight: { type: Number }, // kg
  height: { type: Number }, // cm
  medication: { type: String }, // Description of medication given
  observation: { type: String }, // Coordinator or doctor’s notes
  dateEntered: { 
    type: Date, 
    required: true, 
    default: Date.now 
  }
});

const HealthData = mongoose.model("healthData", HealthDataSchema);

module.exports = HealthData;
