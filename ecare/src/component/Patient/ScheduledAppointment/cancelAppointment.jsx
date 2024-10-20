// CancelAppointment.jsx
import React from "react";
import { toast } from "react-toastify";
import { cancelAppointment } from "../../../services/appointmentServices";

const CancelAppointment = ({ appointmentId, onCancel }) => {
  const handleCancel = async () => {
    try {
      await cancelAppointment(appointmentId);
      toast.success("Appointment canceled successfully");
      onCancel(appointmentId); // Update parent component state
    } catch (error) {
      toast.error("Error canceling appointment");
    }
  };

  return (
    <button onClick={handleCancel} className="cancel-btn">
      Cancel
    </button>
  );
};

export default CancelAppointment;
