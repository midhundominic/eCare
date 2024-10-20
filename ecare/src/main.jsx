import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PatientProvider } from "./context/patientContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PatientProvider>
      <App />
    </PatientProvider>
  </React.StrictMode>
);
