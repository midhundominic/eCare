import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDoctorAppointments,
  markPatientAbsent,
  startConsultation,
} from "../../../services/doctorServices";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { ROUTES } from "../../../router/routes";
import Swal from "sweetalert2";
import styles from './doctorAppointment.module.css';

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
      setAppointments(res?.data?.appointments || []);
    } catch (error) {
      console.error("Error fetching doctor appointments:", error);
    }
  };

  const handleMarkAbsent = async (appointmentId) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark the patient as absent?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark absent",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await markPatientAbsent(appointmentId);
        toast.success("Patient marked as absent");
        fetchDoctorAppointments();
      } catch (error) {
        toast.error("Error marking patient as absent");
      }
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
    <div className={styles.appointmentsList}>
      <h2>My Appointments</h2>
      {appointments.map((appointment) => (
        <div key={appointment._id} className={styles.appointmentCard}>
          <div className={styles.appointmentCardContent}>
            <div className={styles.patientDetails}>
              <p>Patient: {appointment.patientId?.name || "N/A"}</p>
              <p>Date: {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}</p>
              <p>Time Slot: {appointment.timeSlot}</p>
              <p>Status: {appointment.status}</p>
            </div>
            {(appointment.status === "scheduled" || appointment.status === "rescheduled")&& (
              <div className={styles.appointmentActions}>
                <button
                  className={`${styles.actionButton} ${styles.absentButton}`}
                  onClick={() => handleMarkAbsent(appointment._id)}
                >
                  Mark Absent
                </button>
                <button
                  className={styles.actionButton}
                  onClick={() => handleStartConsultation(appointment._id)}
                >
                  Start Consultation
                </button>
              </div>
            )}
            {appointment.status === "in_consultation" && (
              <button
                className={styles.actionButton}
                onClick={() => {
                  const userData = JSON.parse(localStorage.getItem("userData"));
                  const doctorId = userData?.doctorId;
                  navigate(
                    `${ROUTES.DOCTOR_PRESCRIPTION}?appointmentId=${appointment._id}&doctorId=${doctorId}`
                  );
                }}
              >
                Prescribe
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorAppointments;
