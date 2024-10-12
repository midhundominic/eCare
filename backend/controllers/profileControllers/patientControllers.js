const PatientModel = require("../../models/patientModel");
const PatientPersonalInfo = require("../../models/patientPersonalModel");
const generateAdmissionNumber = require("../../utils/admissionNumberGenerator");
const dayjs = require("dayjs");

const getPatientProfile = async (req, res) => {
  const { email } = req.user; // Assuming email is coming from a logged-in user

  try {
    // Fetch basic patient info by email
    const patient = await PatientModel.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Fetch the personal info using email
    let personalInfo = await PatientPersonalInfo.findOne({ email });

    // If no personal info exists, create a default structure
    if (!personalInfo) {
      personalInfo = {
        email: patient.email, // Ensure the email matches
        dateOfBirth: "",
        gender: "",
        weight: 0,
        height: 0,
        profilePhoto: "",
        admissionNumber: "",
        isProfileComplete: false,
      };
    }

    // Return combined patient and personal info
    res.status(201).json({
      patient,
      personalInfo,
    });
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// UPDATE patient profile by email
const updatePatientProfile = async (req, res) => {
  const { email, dateOfBirth, gender, weight, height, profilePhoto } = req.body;
console.log(email, dateOfBirth, gender, weight, height, profilePhoto)
  try {
    // Check if patient exists in PatientModel (core profile)
    const patient = await PatientModel.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Fetch or create personal info for the patient
    let patientProfile = await PatientPersonalInfo.findOne({ email });

    if (!patientProfile) {
      patientProfile = new PatientPersonalInfo({ email });
    }

    // Update personal info fields
    patientProfile.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;  // Directly handle the Date object
    patientProfile.gender = gender;
    patientProfile.weight = weight;
    patientProfile.height = height;
    patientProfile.profilePhoto = profilePhoto;

    // Mark profile as complete and generate admission number if not already set
    if (!patientProfile.isProfileComplete) {
      patientProfile.isProfileComplete = true;

      // Generate unique admission number if not exists
      if (!patientProfile.admissionNumber) {
        let admissionNumber = generateAdmissionNumber();

        // Ensure admission number is unique
        let isUnique = false;
        while (!isUnique) {
          const existingProfile = await PatientPersonalInfo.findOne({
            admissionNumber,
          });
          if (!existingProfile) {
            isUnique = true;
          } else {
            admissionNumber = generateAdmissionNumber();
          }
        }
        patientProfile.admissionNumber = admissionNumber;
      }
    }

    // Save the updated patient profile
    await patientProfile.save();

    res.status(201).json({
      message: "Profile updated successfully",
      profile: patientProfile,
    });
  } catch (error) {
    console.error("Error updating patient profile:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getPatientProfile, updatePatientProfile };
