import apiClient from '../api'

export const analyzePrescription = async (prescriptionImage) => {
    const formData = new FormData();
    formData.append('prescription', prescriptionImage);

    const response = await apiClient.post("/ml/analyze-prescription", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};