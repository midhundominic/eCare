import {
  patientSignin,
  patientSignup,
  authWithGoogle,
  patientView,
} from "../api/patient";

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
export const authWithGoogleService = async (fields) => {
  try {
    const response = await authWithGoogle(fields);

    // Ensure the response structure is consistent with your other services
    return {
      token: response.data.token, // This assumes your backend returns the token directly
      data: response.data || {}, // Assuming the user data is in response.data
    };
  } catch (error) {
    console.error("Error on Google sign-in", error);
    // Handle error appropriately
    return {
      error: true,
      msg: error.response?.data.message || "An error occurred during Google sign-in.",
    };
  }
};

export const getPatients = async (payload) => {
  try {
    const response = await patientView();
    return response;
  } catch (error) {
    console.error("Error Fetching Patient", error);
    throw error;
  }
};
