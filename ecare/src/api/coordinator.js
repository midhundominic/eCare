import apiClient from "./index";

export const coordinatorSignup = async (payload) => {
    try {
      const response = await apiClient.post("/coordinator-registration", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const coordinatorSignin = async (payload) => {
    try {
      const response = await apiClient.post("/coordinator-signin", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };