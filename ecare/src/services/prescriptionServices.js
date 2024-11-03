import apiClient from "../api";

export const submitPrescription = async (prescriptionData) => {
  try {
    const response = await apiClient.post(
      `/prescriptions/create`,
      prescriptionData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting prescription", error);
    throw error;
  }
};

export const getPrescriptionHistory = async (patientId) => {
  try {
    const response = await apiClient.get(`/prescriptions/patient/${patientId}`);
    console.log("records",response);
    return response;
  } catch (error) {
    console.error("Error fetching prescription history", error);
    throw error;
  }
};

export const uploadTestResult = async (formData) => {
  try {
    const response = await apiClient.post(
      "/prescriptions/test/result",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading test result", error);
    throw error;
  }
};

export const getTestResults = async (prescriptionId) => {
  try {
    const response = await apiClient.get(
      `/prescriptions/test-results/${prescriptionId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching test results", error);
    throw error;
  }
};
