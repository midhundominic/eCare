import apiClient from "./index";

export const doctorReg = async (payload) => {
    try {
      const response = await apiClient.post("/doctor_register", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  };