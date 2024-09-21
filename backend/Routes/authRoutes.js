const express = require("express");
const router = express.Router();
const patientControllers = require("../controllers/patientControllers");
const adminControllers = require("../controllers/adminController");
const doctorControllers = require("../controllers/doctorController");
const authControllers = require("../controllers/authControllers");
const coordinatoControllers = require("../controllers/coordinatorControllers");


router.post("/patient-signup", patientControllers.signup);
router.post("/patient-signin", authControllers.signin);
router.post("/patientauthWithGoogle", patientControllers.authWithGoogle); 
router.post("/admin-signin", adminControllers.adminSignin);
router.post("/doctor-registration", doctorControllers.registerDoctor);
router.post("/doctor-signin", authControllers.signin);
router.post("/coordinator-registration", coordinatoControllers.registerCoordinator);
router.post("/coordinator-signin", authControllers.signin);
router.get("/doctors-view",doctorControllers.getAllDoctors);
router.get("/coordinator-view",coordinatoControllers.getAllCoordinator);
router.get("/patients-view",patientControllers.getAllPatient);

module.exports = router;
