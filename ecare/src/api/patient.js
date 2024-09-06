import apiClient from "./index";

export const patientSignup = async (payload) => {
  try {
    const response = await apiClient.post("/patient_signup", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patientSignin = async (payload) => {
  try {
    const response = await apiClient.post("/patient_signin", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const authWithGoogle = async (payload) => {
  try {
    const response = await apiClient.post("/patientauthWithGoogle", payload);
    return response;
  } catch (error) {
    console.error("Error on signin patient", error.response?.data || error.message);
    throw error;
  }
};

