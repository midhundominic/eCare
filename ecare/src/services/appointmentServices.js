import { scheduleAppointmentAPI, getPatientAppointmentsAPI } from "../api/appointment";

// Service to schedule an appointment
export const scheduleAppointment = async (payload) => {
  try {
    const response = await scheduleAppointmentAPI(payload);
    return response;
  } catch (error) {
    console.error("Error scheduling appointment", error);
    throw error;
  }
};

// Service to get patient appointments
export const getPatientAppointments = async (patientId) => {
  try {
    const response = await getPatientAppointmentsAPI(patientId);
    return response;
  } catch (error) {
    console.error("Error fetching appointments", error);
    throw error;
  }
};
