import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { getAppointments } from "../../../services/appointmentServices";
import CancelAppointment from "./cancelAppointment";
import RescheduleAppointment from "./rescheduleAppointment";
import "./appointment.css";
import NothingToShow from "../../Common/NothingToShow";
import { ROUTES } from "../../../router/routes";
import PageTitle from "../../Common/PageTitle";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const navigate = useNavigate();

  const timeSlots = [
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "1:30 PM",
    "2:00 PM",
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const patientId = userData?.userId;

      if (!patientId) return;

      const res = await getAppointments(patientId);
      setAppointments(res?.data?.appointments || []);
    };

    fetchAppointments();
  }, []);

  const handleCancelUpdate = (appointmentId) => {
    setAppointments(appointments.filter((app) => app._id !== appointmentId));
  };

  const handleRescheduleUpdate = (appointmentId, newDate, newTimeSlot) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment._id === appointmentId
          ? {
              ...appointment,
              appointmentDate: newDate,
              timeSlot: newTimeSlot,
              status: "rescheduled",
            }
          : appointment
      )
    );
  };

  const getNextSevenDays = () => {
    const days = [];
    let i = 0;

    while (days.length < 7) {
      const day = dayjs().add(i, "day");
      if (day.day() !== 0) days.push(day);
      i++;
    }
    return days;
  };

  const availableDates = getNextSevenDays();

  return (
    <div className="appointments-list">
      {appointments.length ? (
        <>
          <PageTitle>My Appointments</PageTitle>
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-card-content">
                <p>
                  Doctor: Dr. {appointment.doctorId.firstName}{" "}
                  {appointment.doctorId.lastName}
                </p>
                <p>Specialization: {appointment.doctorId.specialization}</p>
                <p>
                  Date:{" "}
                  {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}
                </p>
                <p>Time Slot: {appointment.timeSlot}</p>
                <p>Status: {appointment.status}</p>
              </div>
              <CancelAppointment
                appointmentId={appointment._id}
                onCancel={handleCancelUpdate}
              />
              <RescheduleAppointment
                appointment={appointment}
                timeSlots={timeSlots}
                availableDates={availableDates}
                onReschedule={handleRescheduleUpdate}
              />
            </div>
          ))}
        </>
      ) : (
        <NothingToShow
          caption="Ready to take the next step?|Let's schedule your first appointment"
          buttonText="Book"
          showCalendar={true}
          onClick={() => navigate(ROUTES.PATIENT_APPOINTMENT)}
        />
      )}
    </div>
  );
};

export default PatientAppointments;
