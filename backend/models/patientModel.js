const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: Number, required: true },
  date_created: { type: Date, required: true, default: () => dayjs().toDate() },
  resetCode: { type: String,default:'' },
  resetCodeExpiration: { type: Date,default:Date.now },
});

// Pre-save hook to hash password before saving
PatientSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Patient = mongoose.model("patient", PatientSchema);

module.exports = Patient;
