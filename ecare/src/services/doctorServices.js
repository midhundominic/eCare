import { doctorSignup, doctorSignin, doctorView } from "../api/doctor";
import apiClient from "../api/index";

export const regDoctor = async (payload) => {
  try {
    const response = await doctorSignup(payload);
    return response;
  } catch (error) {
    console.error("Error on Doctor register", error);
    throw error;
  }
};

export const postSigninDoctor = async (payload) => {
  try {
    const response = await doctorSignin(payload);
    return response;
  } catch (error) {
    console.error("Error on signin patient", error);
    throw error;
  }
};

export const getDoctors = async (payload) => {
  try {
    const response = await doctorView();
    return response;
  } catch (error) {
    console.error("Error fetching doctors list", error);
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await apiClient.get(`/doctor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor by ID", error);
    throw error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const response = await apiClient.delete(`/doctor/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting doctor", error);
    throw error;
  }
};

export const getDoctorAppointments = async (doctorId) => {
  try {
    const response = await apiClient.get(`/doctor-appointments/${doctorId}`);
    return response;
  } catch (error) {
    console.error("Error fetching doctor appointments", error);
    throw error;
  }
};

export const applyForLeave = async (leaveData) => {
  try {
    const response = await apiClient.post(`/leaves/apply/${leaveData.doctorId}`, leaveData);
    return response.data;
  } catch (error) {
    console.error("Error applying for leave", error);
    throw error;
  }
};

// New method to fetch leave status
export const fetchLeaveStatus = async (doctorId) => {
  try {
    const response = await apiClient.get(`/leaves/${doctorId}`);
    console.log("111111111",response.data.leaveRequests);
    return response.data.leaveRequests; // Adjust based on your API response
  } catch (error) {
    console.error("Error fetching leave status", error);
    throw error;
  }
};

export const cancelLeave = async (leaveId) => {
  try {
    const response = await apiClient.delete(`/leaves/cancel/${leaveId}`);
    return response.data; // Return the response message
  } catch (error) {
    console.error("Error canceling leave", error);
    throw error;
  }
};