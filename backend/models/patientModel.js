const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Password is hashed, so required: false is fine.
  role: { type: Number, required: true },
  date_created: { type: Date, required: true, default: () => dayjs().toDate() },
});

// Pre-save hook to hash password before saving
PatientSchema.pre("save", async function (next) {
  try {
    // Only hash the password if it has been modified or is new
    if (!this.isModified("password")) return next();

    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Patient = mongoose.model("patient", PatientSchema);

module.exports = Patient;
