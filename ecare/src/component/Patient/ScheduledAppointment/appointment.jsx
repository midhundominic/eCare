import React, { useEffect, useState } from "react";
import {
  getAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getUnavailableTimeSlots,
} from "../../../services/appointmentServices";
import Modal from "react-modal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "./appointment.css";

Modal.setAppElement("#root");

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  const timeSlots = [
    "9:30 AM - 10:00 AM",
    "10:00 AM - 10:30 AM",
    "10:30 AM - 11:00 AM",
    "11:00 AM - 11:30 AM",
    "11:30 AM - 12:00 PM",
    "12:00 PM - 12:30 PM",
    "1:30 PM - 2:00 PM",
    "2:00 PM - 2:30 PM",
  ];

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const patientId = userData?.userId;

        if (!patientId) {
          console.error("Patient ID not found");
          return;
        }

        const res = await getAppointments(patientId);
        if (res && res.data && res.data.appointments) {
          setAppointments(res.data.appointments);
        } else {
          setAppointments([]);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      toast.success("Appointment canceled successfully");
      setAppointments(appointments.filter((app) => app._id !== appointmentId));
    } catch (error) {
      toast.error("Error canceling appointment");
    }
  };

  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalIsOpen(true);
    setAvailableTimeSlots(timeSlots); // Reset available time slots
    setRescheduleDate(""); // Reset date
    setRescheduleTimeSlot(""); // Reset time slot
  };

  // Function to get next 7 days excluding Sundays
  const getNextSevenDays = () => {
    const days = [];
    let i = 0;

    while (days.length < 7) {
      const day = dayjs().add(i, "day");
      // Exclude Sundays (day 0 in dayjs is Sunday)
      if (day.day() !== 0) {
        days.push(day);
      }
      i++;
    }

    return days;
  };

  const availableDates = getNextSevenDays();

  const handleDateSelect = async (date) => {
    setRescheduleDate(date);
  
    const isToday = dayjs().format("YYYY-MM-DD") === date;
  
    // If the selected date is today, filter out past time slots
    let filteredTimeSlots = timeSlots;
    if (isToday) {
      const currentTime = dayjs(); // Get the current time
  
      filteredTimeSlots = timeSlots.filter((slot) => {
        const [startTime] = slot.split(" - "); // Extract the start time from the slot
        const slotTime = dayjs(`${date} ${startTime}`, "YYYY-MM-DD h:mm A"); // Combine the date and start time
  
        return slotTime.isAfter(currentTime); // Keep the slot only if it's in the future
      });
    }
  
    setAvailableTimeSlots(filteredTimeSlots); // Reset available time slots for the selected date
  
    if (selectedAppointment && date) {
      try {
        const unavailableSlots = await getUnavailableTimeSlots(
          selectedAppointment.doctorId._id,
          date
        );
  
        // Filter out unavailable time slots
        setAvailableTimeSlots((prevSlots) =>
          prevSlots.filter((slot) => !unavailableSlots.includes(slot))
        );
      } catch (error) {
        console.error("Error fetching unavailable time slots:", error);
        toast.error("Error fetching time slots. Please try again later.");
      }
    }
  };
  

  const handleReschedule = async () => {
    try {
      const rescheduleData = {
        appointmentDate: rescheduleDate,
        timeSlot: rescheduleTimeSlot,
      };

      // Call the reschedule API
      await rescheduleAppointment(selectedAppointment._id, rescheduleData);

      // Update the appointments state after successful reschedule
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === selectedAppointment._id
            ? {
                ...appointment,
                appointmentDate: rescheduleDate,
                timeSlot: rescheduleTimeSlot,
                status: "rescheduled", // Optionally update the status as well
              }
            : appointment
        )
      );

      toast.success("Appointment rescheduled successfully");

      // Close the modal
      setModalIsOpen(false);
    } catch (error) {
      toast.error("Error rescheduling appointment");
    }
  };

  return (
    <div className="appointments-list">
      <h2>My Appointments</h2>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="appointment-card">
          <div className="appointment-card-content">
            <div className="doctor-details">
              <p>
                Doctor: Dr. {appointment.doctorId.firstName}{" "}
                {appointment.doctorId.lastName}
              </p>
              <p>Specialization: {appointment.doctorId.specialization}</p>
              <p>
                Date: {dayjs(appointment.appointmentDate).format("YYYY-MM-DD")}
              </p>
              <p>Time Slot: {appointment.timeSlot}</p>
              <p>Status: {appointment.status}</p>
            </div>
          </div>
          <button
            onClick={() => handleCancel(appointment._id)}
            className="cancel-btn"
          >
            Cancel
          </button>
          <button
            onClick={() => openRescheduleModal(appointment)}
            className="reschedule-btn"
          >
            Reschedule
          </button>
        </div>
      ))}

      {/* Reschedule Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="reschedule-modal"
        overlayClassName="reschedule-modal-overlay"
      >
        <h2>Reschedule Appointment</h2>

        {/* Date selection */}
        <div className="form-group date-picker">
          <label>Select Date:</label>
          <div className="date-options">
            {availableDates.map((day, index) => (
              <button
                key={index}
                className={`date-btn ${
                  rescheduleDate === day.format("YYYY-MM-DD") ? "selected" : ""
                }`}
                onClick={() => handleDateSelect(day.format("YYYY-MM-DD"))}
              >
                <div>{day.format("ddd").toUpperCase()}</div>
                <div>{day.format("DD")}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Time slot selection */}
        <div className="form-group">
          <label>Select Time Slot:</label>
          <div className="time-slot-options">
            {timeSlots.map((slot) => {
              const isUnavailable = !availableTimeSlots.includes(slot);
              return (
                <button
                  key={slot}
                  className={`time-slot-btn ${
                    rescheduleTimeSlot === slot ? "selected" : ""
                  } ${isUnavailable ? "unavailable" : ""}`}
                  onClick={() => !isUnavailable && setRescheduleTimeSlot(slot)}
                  disabled={isUnavailable}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Reschedule Button */}
        <button className="submit-btn" onClick={handleReschedule}>
          Confirm Reschedule
        </button>
        <button className="cancel-btn" onClick={() => setModalIsOpen(false)}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default PatientAppointments;
