import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Login from "../component/Login";
import Signup from "../component/Signup";
import Main from "../component/Main";
import PatientHome from "../component/Patient/PatientHome";
import PatientAppointments from "../component/Patient/PatientAppointments";
import PatientProfile from "../component/Patient/PatientProfile";
import Admin from "../component/Admin/Login";
import AdminHome from "../component/Admin/Home";
import DoctorRegister from "../component/Admin/RegisterDoctor";
import { ROUTES, NON_AUTH_ROUTES } from "./routes";
import DoctorsList from "../component/Admin/DoctorsList";
import DoctorHome from "../component/Doctor/DoctorHome";
import CoordinatorHome from "../component/Coordinator/CoordinatorHome";
import CoordinatorRegister from "../component/Admin/RegisterCoordinator";
import CoordinatorList from "../component/Admin/CoordinatorList";
import PatientList from "../component/Admin/PatientiList";
import ForgotPassword from "../component/ForgotPassword";
import VarifyCode from "../component/VarifyCode";
import ResetPassword from "../component/ResetPassword";

const Router = () => {
  const location = useLocation();
  const isAuthRoute = !NON_AUTH_ROUTES.includes(location.pathname);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {isAuthRoute ? (
        <Routes>
          <Route
            path={ROUTES.DEFAULT}
            element={<Navigate to={ROUTES.LOGIN} />}
          />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
          <Route path={ROUTES.ADMIN} element={<Admin />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.VARIFY_CODE} element={<VarifyCode />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
        </Routes>
      ) : (
        <Main>
          <Routes>
            <Route path={ROUTES.PATIENT_HOME} element={<PatientHome />} />
            <Route path={ROUTES.ADMIN_HOME} element={<AdminHome />} />
            <Route path={ROUTES.DOCTOR_HOME} element={<DoctorHome />} />
            <Route path={ROUTES.DOCTOR_REGISTER} element={<DoctorRegister />} />
            <Route
              path={ROUTES.COORDINATOR_REGISTER}
              element={<CoordinatorRegister />}
            />
            <Route
              path={ROUTES.COORDINATOR_HOME}
              element={<CoordinatorHome />}
            />
            <Route
              path={ROUTES.PATIENT_APPOINTMENT}
              element={<PatientAppointments />}
            />
            <Route path={ROUTES.PATIENT_PROFILE} element={<PatientProfile />} />
            <Route path={ROUTES.ADMIN_DOC_LIST} element={<DoctorsList />} />
            <Route
              path={ROUTES.ADMIN_COORDINATOR_LIST}
              element={<CoordinatorList />}
            />
            <Route path={ROUTES.ADMIN_PATIENT_LIST} element={<PatientList />} />
          </Routes>
        </Main>
      )}
    </div>
  );
};

export default Router;
