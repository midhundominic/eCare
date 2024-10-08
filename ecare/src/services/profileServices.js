import {
  fetchCoordinatorProfile,
  fetchDoctorProfile,
  fetchPatientProfile,
  updatePatientProfile,
  uploadDoctorProfileImage,
} from "../api/profile";

export const getProfileCoordinator = async () => {
  try {
    const response = await fetchCoordinatorProfile();
    return response;
  } catch (error) {
    console.error("Error Fetching Coordinator", error);
    throw error;
  }
};

export const getProfilePatient = async () => {
  try {
    const response = await fetchPatientProfile();
    return response;
  } catch (error) {
    console.error("Error Fetching Patient", error);
  }
};

export const updateProfilePatient = async (payload) => {
  try {
    const response = await updatePatientProfile(payload);  // Added update service for PUT request
    return response.data;
  } catch (error) {
    console.error("Error updating Patient profile", error);
    throw error;
  }
};

export const getProfileDoctor = async () => {
  try {
    const response = await fetchDoctorProfile();
    return response;
  } catch (error) {
    console.error("Error Fetching Patient", error);
  }
};

export const uploadDoctorProfilePic = async (formData) => {
  try {
    const response = await uploadDoctorProfileImage(formData);
    console.log("API Response:", response);
    return response;
  } catch (error) {
    console.error("Error uploading doctor profile image", error);
    throw error;
  }
}

// export const getDoctorProfilePhoto = async () => {
//   try {
//     const response = await getDoctorPhoto();
//     return response;
//   } catch (error) {
//     console.error("Error Fetching Patient", error);
//   }
// };
