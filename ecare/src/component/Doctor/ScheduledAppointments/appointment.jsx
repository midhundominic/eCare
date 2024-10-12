import React, { useEffect, useState } from "react";
import { getDoctorAppointments} from "../../../services/doctorServices";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "./appointment.css";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
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
          setAppointments(res.data.appointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    };

    fetchDoctorAppointments();
  }, []);

  return (
    <div className="appointments-list">
      <h2>My Appointments</h2>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="appointment-card">
          <div className="appointment-card-content">
            <div className="patient-details">
              <p>
                Patient: {appointment.patientId.firstName}{" "}
                {appointment.patientId.lastName}
              </p>
              <p>
                Date: {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}
              </p>
              <p>Time Slot: {appointment.timeSlot}</p>
              <p>Status: {appointment.status}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorAppointments;
