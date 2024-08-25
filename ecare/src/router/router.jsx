import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../component/Login";
import Signup from "../component/Signup";
import { HOME, LOGIN, SIGNUP } from "./routes";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={HOME} element={<Login />} />
        <Route path={SIGNUP} element={<Signup />} />
        <Route path={LOGIN} element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
