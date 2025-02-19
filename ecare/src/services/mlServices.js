import apiClient from '../api'

export const analyzePrescription = async (prescriptionImage) => {
    try {
        const formData = new FormData();
        formData.append('prescription', prescriptionImage);

        const response = await apiClient.post("/ml/analyze-prescription", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 30000, // 30 second timeout
        });
        
        if (!response.data.success) {
            throw new Error(response.data.error || 'Failed to analyze prescription');
        }
        console.log("Resonse from Python",response);
        
        return response.data;
    } catch (error) {
        console.error('Error in analyzePrescription:', error);
        throw new Error(error.response?.data?.error || error.message || 'Failed to analyze prescription');
    }
};