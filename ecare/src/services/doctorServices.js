import { doctorReg } from "../api/doctor";

export const regDoctor = async (payload) => {
    try {
      const response = await doctorReg(payload);
      return response;
    } catch (error) {
      console.error("Error on Doctor register", error);
      throw error;
    }
  };