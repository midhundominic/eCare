import { coordinatorSignin, coordinatorSignup } from "../api/coordinator";

export const regCoordinator = async (payload) => {
  try {
    const response = await coordinatorSignup(payload);
    return response;
  } catch (error) {
    console.error("Error on Doctor register", error);
    throw error;
  }
};

export const postSigninCoordinator = async (payload) => {
    try {
      const response = await coordinatorSignin(payload);
      return response;
    } catch (error) {
      console.error("Error on signin Coordinator", error);
      throw error;
    }
  };
  