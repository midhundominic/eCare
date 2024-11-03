import ScheduledAppointments from "../component/Doctor/ScheduledAppointments";

export const ROUTES = {
  DEFAULT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PATIENT_HOME: "/patient/home",
  PATIENT_APPOINTMENT: "/patient/appointments",
  PATIENT_RECORDS:"/patient/record",
  PATIENT_PAYMENTS:"/patient/payment",
  PATIENT_CONSULTATION:"/patient/consultation",
  SCHEDULED_APPOINTMENT: "/patient/scheduled",
  SCHEDULED_APPOINTMENTS: "/doctor/scheduled",
  ADMIN_APPOINTMENTS: "/admin/appointments",
  PATIENT_PROFILE: "/patient/profile",
  ADMIN: "/admin",
  ADMIN_HOME: "/admin/home",
  ADMIN_LEAVE: "/admin/leave",
  DOCTOR_HOME: "/doctor/home",
  DOCTOR_LEAVE:"/doctor/leave",
  ADMIN_DOC_LIST: "/admin/doctors",
  DOCTOR_REGISTER: "/doctor/reg",
  COORDINATOR_REGISTER: "/coordinator/reg",
  COORDINATOR_HOME: "/coordinator/home",
  ADMIN_COORDINATOR_LIST: "/admin/coordinator",
  ADMIN_PATIENT_LIST: "/admin/patient",
  FORGOT_PASSWORD: "/forgotpassword",
  RESET_PASSWORD: "/resetpassword",
  VARIFY_CODE: "/varify",
  ADMIN_PROFILE: "/adminprofile",
  DOCTOR_PROFILE: "/doctorprofile",
  DOCTOR_PATIENTLIST:"/doctor/patientlist",
  COORDINATOR_PROFILE: "/coordinatorprofile",
  HEALTH_RECORDS: "/coordinator/records",
  DOCTOR_PRESCRIPTION: "/doctor/prescription",
  COMPLETED_APPOINTMENT: "/patient/completed",
  TEST_RESULTS: "/coordinator/test",
  COMPLETED_RESULT: "/coordinator/completed-test",
  MEDICINE_LIST: "/coordinator/medicineList",
};

export const NON_AUTH_ROUTES = [
  ROUTES.PATIENT_HOME,
  ROUTES.PATIENT_APPOINTMENT,
  ROUTES.SCHEDULED_APPOINTMENT,
  ROUTES.SCHEDULED_APPOINTMENTS,
  ROUTES.PATIENT_RECORDS,
  ROUTES.PATIENT_PAYMENTS,
  ROUTES.PATIENT_CONSULTATION,
  ROUTES.ADMIN_APPOINTMENTS,
  ROUTES.PATIENT_PROFILE,
  ROUTES.ADMIN_PROFILE,
  ROUTES.DOCTOR_PROFILE,
  ROUTES.DOCTOR_PATIENTLIST,
  ROUTES.COORDINATOR_PROFILE,
  ROUTES.HEALTH_RECORDS,
  ROUTES.ADMIN_HOME,
  ROUTES.ADMIN_LEAVE,
  ROUTES.ADMIN_DOC_LIST,
  ROUTES.DOCTOR_REGISTER,
  ROUTES.DOCTOR_HOME,
  ROUTES.DOCTOR_LEAVE,
  ROUTES.COORDINATOR_REGISTER,
  ROUTES.COORDINATOR_HOME,
  ROUTES.ADMIN_COORDINATOR_LIST,
  ROUTES.ADMIN_PATIENT_LIST,
  ROUTES.DOCTOR_PRESCRIPTION,
  ROUTES.COMPLETED_APPOINTMENT,
  ROUTES.TEST_RESULTS,
  ROUTES.COMPLETED_RESULT,
  ROUTES.MEDICINE_LIST,
];
