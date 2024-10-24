import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDoctorAppointments,
  markPatientAbsent,
  startConsultation,
} from "../../../services/doctorServices";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "./appointment.css";
import { ROUTES } from "../../../router/routes";
import Button from "../.../../../Common/Button";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const fetchDoctorAppointments = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const doctorId = userData?.doctorId;

      if (!doctorId) {
        console.error("Doctor ID not found");
        return;
      }

      const res = await getDoctorAppointments(doctorId);
      if (res && res.data && res.data.appointments) {
        console.log("Fetched appointments:", res.data.appointments);
        setAppointments(res.data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
    }
  };

  const handleMarkAbsent = async (appointmentId) => {
    try {
      await markPatientAbsent(appointmentId);
      toast.success("Patient marked as absent");
      fetchDoctorAppointments();
    } catch (error) {
      toast.error("Error marking patient as absent");
    }
  };

  const handleStartConsultation = async (appointmentId) => {
    try {
      await startConsultation(appointmentId);
      toast.success("Consultation started");
      fetchDoctorAppointments();
    } catch (error) {
      toast.error("Error starting consultation");
    }
  };

  return (
    <div className="appointments-list">
      <h2>My Appointments</h2>
      {appointments.map((appointment) => {
        console.log("Rendering appointment:", appointment);
        return (
          <div key={appointment._id} className="appointment-card">
            <div className="appointment-card-content">
              <div className="patient-details">
                <p>Patient: {appointment.patientId?.name || "N/A"}</p>
                <p>
                  Date:{" "}
                  {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}
                </p>
                <p>Time Slot: {appointment.timeSlot}</p>
                <p>Status: {appointment.status}</p>
              </div>
              {appointment.status === "scheduled" && (
                <div className="appointment-actions">
                  <Button onClick={() => handleMarkAbsent(appointment._id)}>
                    Mark Absent/
                  </Button>
                  <Button
                    onClick={() => handleStartConsultation(appointment._id)}
                  >
                    Start Consultation
                  </Button>
                </div>
              )}
              {appointment.status === "in_consultation" && (
                <Button
                  onClick={() => {
                    const userData = JSON.parse(
                      localStorage.getItem("userData")
                    );
                    const doctorId = userData?.doctorId;
                    navigate(`${ROUTES.DOCTOR_PRESCRIPTION}?appointmentId=${appointment._id}&doctorId=${doctorId}`);

                  }}
                >
                  Prescribe
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DoctorAppointments;
