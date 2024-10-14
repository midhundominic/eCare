import { adminSignin } from "../api/admin";
import apiClient from "../api/index";

export const postSignin = async (payload) => {
    try {
      const response = await adminSignin(payload);
      return response;
    } catch (error) {
      console.error("Error on signin Admin", error);
      throw error;
    }
  };

  export const getAllAppointments = async () => {
    try {
      const response = await apiClient.get("/appointments");
      return response.data.appointments;
    } catch (error) {
      console.error("Error fetching appointments", error);
      throw error;
    }
  };
  
  // Cancel an appointment
  export const cancelAppointment = async (appointmentId) => {
    try {
      const response = await apiClient.put(`/admin/cancel-appointment/${appointmentId}`);
      return response.data;
    } catch (error) {
      console.error("Error canceling appointment", error);
      throw error;
    }
  };
  
  // Reschedule an appointment
  export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
    try {
      const response = await apiClient.put(`/admin/reschedule-appointment/${appointmentId}`, rescheduleData);
      return response.data;
    } catch (error) {
      console.error("Error rescheduling appointment", error);
      throw error;
    }
  };

  export const getUnavailableTimeSlots = async (doctorId, date) => {
    try {
      const response = await apiClient.get(`/appointments/unavailable-slots`, {
        params: { doctorId, date },
      });
      return response.data.unavailableSlots || [];
    } catch (error) {
      console.error("Error fetching unavailable time slots", error);
      return [];
    }
  };

  export const getLeaveRequests = async () => {
    try {
      const response = await apiClient.get("/leaves");
      console.log("111",response);
      return response;
    } catch (error) {
      console.error("Error fetching leave requests", error);
      throw error;
    }
  };
  
  // Update the status of a doctor's leave (approve or reject)
  export const updateLeaveStatus = async (leaveData) => {
    try {
      const response = await apiClient.post("/leaves/status", leaveData);
      return response.data;
    } catch (error) {
      console.error("Error updating leave status", error);
      throw error;
    }
  };