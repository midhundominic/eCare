import { patientSignin, patientSignup, authWithGoogle } from "../api/patient";

export const postSignup = async (payload) => {
  try {
    const response = await patientSignup(payload);
    // You can add additional logic here
    return response;
  } catch (error) {
    console.error("Error on signup patient", error);
    throw error;
  }
};

export const postSignin = async (payload) => {
  try {
    const response = await patientSignin(payload);
    // You can add additional logic here
    return response;
  } catch (error) {
    console.error("Error on signin patient", error);
    throw error;
  }
};

export const authWithGoogleService = async (payload) => {
  try {
    const response = await authWithGoogle(payload);
    // You can add additional logic here
    return response;
  } catch (error) {
    console.error("Error on signin patient", error);
    throw error;
  }
};