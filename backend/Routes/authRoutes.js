const express = require("express");
const router = express.Router();
const patientControllers = require("../controllers/patientControllers");
const adminControllers = require("../controllers/adminController");
const doctorControllers = require("../controllers/doctorController");

// Define the POST route for sign-up
router.post("/patient-signup", patientControllers.signup);
router.post("/patient-signin", patientControllers.signin);
router.post("/patientauthWithGoogle", patientControllers.authWithGoogle); // Add this route
router.post("/admin-signin", adminControllers.adminSignin);
router.post("/doctor-registration", doctorControllers.registerDoctor);
router.post("/doctor-signin", doctorControllers.signin);

module.exports = router;
