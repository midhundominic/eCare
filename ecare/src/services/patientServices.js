import { patientSignin, patientSignup } from "../api/patient";

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

