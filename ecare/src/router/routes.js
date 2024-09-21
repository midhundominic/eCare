export const ROUTES = {
  DEFAULT: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  PATIENT_HOME: "/patient/home",
  PATIENT_APPOINTMENT: "/patient/appointments",
  PATIENT_PROFILE: "/patient/profile",
  ADMIN: "/admin",
  ADMIN_HOME: "/admin/home",
  DOCTOR_HOME:"/doctor/home",
  ADMIN_DOC_LIST: "/admin/doctors",
  DOCTOR_REGISTER: "/doctor/reg",
  COORDINATOR_REGISTER: "/coordinator/reg",
  COORDINATOR_HOME:"/coordinator/home",
  ADMIN_COORDINATOR_LIST:"/admin/coordinator",
  ADMIN_PATIENT_LIST:"/admin/patient"
};

export const NON_AUTH_ROUTES = [
  ROUTES.PATIENT_HOME,
  ROUTES.PATIENT_APPOINTMENT,
  ROUTES.PATIENT_PROFILE,
  ROUTES.ADMIN_HOME,
  ROUTES.ADMIN_DOC_LIST,
  ROUTES.DOCTOR_REGISTER,
  ROUTES.DOCTOR_HOME,
  ROUTES.COORDINATOR_REGISTER,
  ROUTES.COORDINATOR_HOME,
  ROUTES.ADMIN_COORDINATOR_LIST,
  ROUTES.ADMIN_PATIENT_LIST,
];
