// import { scheduleAppointmentAPI, getPatientAppointmentsAPI } from "../api/appointment";
import apiClient from "../api";

// Service to schedule an appointment
// export const scheduleAppointment = async (payload) => {
//   try {
//     const response = await scheduleAppointmentAPI(payload);
//     return response;
//   } catch (error) {
//     console.error("Error scheduling appointment", error);
//     throw error;
//   }
// };

// Service to get patient appointments
// export const getPatientAppointments = async (patientId) => {
//   try {
//     const response = await getPatientAppointmentsAPI(patientId);
//     return response;
//   } catch (error) {
//     console.error("Error fetching appointments", error);
//     throw error;
//   }
// };

export const createAppointment = async (appointmentData) => {
  try {
    const response = await apiClient.post("/create-appointment", appointmentData);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment", error);
    throw error;
  }
};

export const getUnavailableTimeSlots = async (doctorId, date) => {
  try {
    const response = await apiClient.get("/availability", {
      params: { doctorId, date },
    });
    return response.data.unavailableSlots || [];
  } catch (error) {
    console.error("Error fetching unavailable time slots", error);
    throw error;
  }
};