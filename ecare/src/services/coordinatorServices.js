import { coordinatorSignin, coordinatorSignup, coordinatorView } from "../api/coordinator";

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

  export const getCoordinator = async () => {
    try {
      const response = await coordinatorView();
      return response;
    } catch (error) {
      console.error("Error fetching coordinator list", error);
      throw error;
    }
  };

  export const updateCoordinator= async () => {
    try {
      const response = await coordinatorUpdate();
      return response;
    }catch(error) {
      console.error("Error Updating coordinator");
      throw error;
    }
  }
  