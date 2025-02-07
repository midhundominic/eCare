import apiClient from "../api";

export const analyzePrescriptionImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('prescriptionImage', imageFile);

    const response = await apiClient.post('/prescriptions/process-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const analyzePrescriptionText = async (text) => {
  try {
    const response = await apiClient.post('/prescriptions/analyze', { text });
    return response.data;
  } catch (error) {
    throw error;
  }
};

