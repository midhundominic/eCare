import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "../component/Login";
import Signup from "../component/Signup";
import Home from "../component/Main";
import { DEFAULT, HOME, LOGIN, SIGNUP } from "./routes";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={DEFAULT} element={<Navigate to={LOGIN} />} />
        <Route path={LOGIN} element={<Login />} />
        <Route path={SIGNUP} element={<Signup />} />
        <Route path={HOME} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
