import { doctorSignup, doctorSignin, doctorView } from "../api/doctor";

export const regDoctor = async (payload) => {
  try {
    const response = await doctorSignup(payload);
    return response;
  } catch (error) {
    console.error("Error on Doctor register", error);
    throw error;
  }
};

export const postSigninDoctor = async (payload) => {
  try {
    const response = await doctorSignin(payload);
    return response;
  } catch (error) {
    console.error("Error on signin patient", error);
    throw error;
  }
};

export const getDoctors = async (payload) => {
  try {
    const response = await doctorView();
    return response;
  } catch (error) {
    console.error("Error fetching doctors list", error);
    throw error;
  }
};
