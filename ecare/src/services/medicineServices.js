import apiClient from "../api";

export const getMedicinesList = async () => {
  try {
    const response = await apiClient.get('/medicines/list');
    return response.data;
  } catch (error) {
    console.error("Error fetching medicines list", error);
    throw error;
  }
};

export const addMedicine = async (medicineData) => {
  try {
    const response = await apiClient.post('/medicines/add', medicineData);
    return response.data;
  } catch (error) {
    console.error("Error adding medicine", error);
    throw error;
  }
};

export const updateMedicineStock = async (medicineId, stockData) => {
  try {
    const response = await apiClient.patch(`/medicines/stock/${medicineId}`, stockData);
    return response.data;
  } catch (error) {
    console.error("Error updating medicine stock", error);
    throw error;
  }
};

export const getMedicineDetails = async (medicineId) => {
  try {
    const response = await apiClient.get(`/medicines/${medicineId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching medicine details", error);
    throw error;
  }
};

export const deleteMedicine = async (medicineId) => {
  try {
    const response = await apiClient.delete(`/medicines/${medicineId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting medicine", error);
    throw error;
  }
};