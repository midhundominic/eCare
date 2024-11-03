const Prescription = require('../models/prescriptionModel');
const TestResult = require('../models/testResultModel');
const Appointment = require('../models/appointmentModel');
const multer = require('multer');
const path = require('path');

// Configure multer for PDF storage
const storage = multer.diskStorage({
  destination: './uploads/testResults',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
}).single('resultPDF');

exports.createPrescription = async (req, res) => {
    try {
      const { appointmentId,doctorId, medicines, tests, notes } = req.body;
  
      // Get appointment details to get patient ID
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
  
      const prescription = new Prescription({
        appointmentId,
        patientId: appointment.patientId,
        doctorId, // From auth middleware
        medicines,
        tests,
        notes
      });
  
      await prescription.save();
      await Appointment.findByIdAndUpdate(appointmentId, {
        status: "completed",
        prescription: {
          medicines: medicines.map(med => ({
            name: med.medicine,
            dosage: `${med.frequency} for ${med.days} days`
          })),
          tests: tests.map(test => ({
            name: test.testName,
            result: ""
          })),
          notes: notes
        }
      });
      res.status(201).json(prescription);
    } catch (error) {
      console.error("Prescription creation error:", error);
      res.status(400).json({ 
        message: error.message || "Error creating prescription",
        error: error
      });
    }
  };

exports.uploadTestResult = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const testResult = new TestResult({
        testName: req.body.testName,
        patientId: req.body.patientId,
        prescriptionId: req.body.prescriptionId,
        resultPDF: req.file.path,
        uploadedBy: req.user._id
      });

      await testResult.save();

      // Update prescription test status
      await Prescription.updateOne(
        { 
          _id: req.body.prescriptionId,
          'tests.testName': req.body.testName 
        },
        { 
          $set: { 
            'tests.$.isCompleted': true,
            'tests.$.resultId': testResult._id
          } 
        }
      );

      res.status(201).json(testResult);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
};

// Add these methods to the existing prescriptionController.js

exports.getPrescription = async (req, res) => {
    try {
      const prescription = await Prescription.findById(req.params.id)
        .populate('medicines.medicineId')
        .populate('doctorId', 'name specialization')
        .populate('patientId', 'name');
        
      if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
      }
      res.status(201).json(prescription);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getPatientPrescriptions = async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ patientId: req.params.patientId })
        .populate('medicines.medicineId')
        .populate('doctorId', 'name specialization')
        .sort({ createdAt: -1 });
      
      res.status(201).json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getDoctorPrescriptions = async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ doctorId: req.params.doctorId })
        .populate('medicines.medicineId')
        .populate('patientId', 'name')
        .sort({ createdAt: -1 });
      
      res.status(201).json(prescriptions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.getTestResults = async (req, res) => {
    try {
      const testResults = await TestResult.find({ prescriptionId: req.params.prescriptionId })
        .populate('uploadedBy', 'name')
        .sort({ uploadDate: -1 });
      
      res.status(201).json(testResults);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };