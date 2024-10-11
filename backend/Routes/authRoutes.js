const express = require("express");
const router = express.Router();
const patientControllers = require("../controllers/patientControllers");
const adminControllers = require("../controllers/adminController");
const doctorControllers = require("../controllers/doctorController");
const authControllers = require("../controllers/authControllers");
const coordinatoControllers = require("../controllers/coordinatorControllers");
const forgotPassword = require("../controllers/authforgotPassword");
const resetPassword = require("../controllers/resetPassword");
const profileCoordinator = require("../controllers/profileControllers/coordinatorControllers");
const authMiddleware = require("../middleware/auth");
const uploadMiddleware = require("../middleware/upload");
const profilePatient = require("../controllers/profileControllers/patientControllers");
const profileDoctor = require ("../controllers/profileControllers/doctorControllers")


//patient

router.post("/patient-signup", patientControllers.signup);
router.post("/patient-signin", authControllers.signin);
router.post("/patientauthWithGoogle", patientControllers.authWithGoogle); 
router.post("/forgot-password",forgotPassword.forgotPassword);
router.post("/varifycode",resetPassword.verifyCode);
router.post("/reset-password",resetPassword.resetPassword);
router.get("/patients-view",patientControllers.getAllPatient);

//doctor

router.post("/doctor-registration", doctorControllers.registerDoctor);
router.post("/doctor-signin", authControllers.signin);
router.get("/doctors-view",doctorControllers.getAllDoctors);

//doctorid
router.get("/doctor/:id", doctorControllers.getDoctorById);



router.post("/admin-signin", adminControllers.adminSignin);

//coordinator

router.post("/coordinator-registration", coordinatoControllers.registerCoordinator);
router.post("/coordinator-signin", authControllers.signin);
router.get("/coordinator-view",coordinatoControllers.getAllCoordinator);


//profile Photo

router.post("/doctor-profile-photo",profileDoctor.uploadDoctorProfilePhoto);


//profile
router.get("/coordinator-profile",authMiddleware,profileCoordinator.getCoordinatorProfile);
router.get("/patient-profile", authMiddleware, profilePatient.getPatientProfile);
router.put("/patient-profile", authMiddleware, profilePatient.updatePatientProfile);
router.get("/doctor-profile",authMiddleware,profileDoctor.getDoctorProfile);
router.put("/coordinator-update",profileCoordinator.updateCoordinatorProfile);

//delete
router.delete("/doctor/:id",doctorControllers.deleteDoctor);
router.delete("/patient/:id",patientControllers.deletePatientById);
router.delete("/coordinator/:id",coordinatoControllers.deleteCoordinator);

module.exports = router;
