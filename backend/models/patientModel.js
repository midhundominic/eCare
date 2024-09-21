const mongoose = require("mongoose");
const dayjs = require("dayjs");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: Number, required: true },
  date_created: { type: Date, required: true, default: () => dayjs().toDate() },
});

const Patient = mongoose.model("patient", PatientSchema);

module.exports = Patient;
