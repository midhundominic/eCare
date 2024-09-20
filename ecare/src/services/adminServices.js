import { adminSignin } from "../api/admin";

export const postSignin = async (payload) => {
    try {
      const response = await adminSignin(payload);
      return response;
    } catch (error) {
      console.error("Error on signin Admin", error);
      throw error;
    }
  };