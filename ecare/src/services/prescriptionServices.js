import apiClient from "../api";

export const submitPrescription = async (prescriptionData) => {
  try {
    const response = await apiClient.post(
      `/prescriptions/create`,
      prescriptionData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting prescription", error);
    throw error;
  }
};

export const updatePrescription = async (appointmentId, prescriptionData) => {
  try {
    const response = await apiClient.put(
      `/prescriptions/update/${appointmentId}`,
      prescriptionData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating prescription", error);
    throw error;
  }
};

export const getPrescriptionHistory = async (patientId) => {
  try {
    const response = await apiClient.get(`/prescriptions/patient/${patientId}`);
    return response;
  } catch (error) {
    console.error("Error fetching prescription history", error);
    throw error;
  }
};

export const getPrescriptionDetails = async () => {
  try {
    const response = await apiClient.get('/prescriptions/pending-tests'); // Updated endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw new Error(error.response?.data?.message || 'Error fetching prescription details');
  }
};

export const uploadTestResult = async (formData) => {
  try {
    const response = await apiClient.post('/prescriptions/upload-test-result', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error uploading test result');
  }
};

export const downloadTestResult = async (testResultId) => {
  try {
    const response = await apiClient.get(`/prescriptions/test-result/${testResultId}`, {
      responseType: 'blob'
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `test-result-${testResultId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading test result", error);
    throw error;
  }
};
