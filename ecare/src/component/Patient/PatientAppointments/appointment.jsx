import React, { useEffect, useState } from "react";
import { getDoctors } from "../../../services/doctorServices";
import { createAppointment, getUnavailableTimeSlots } from "../../../services/appointmentServices";
import { getProfilePatient } from "../../../services/profileServices";
import Modal from "react-modal";
import dayjs from "dayjs";
import "./appointment.css";
import { toast } from "react-toastify";

const DoctorProfiles = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [patientId, setPatientId] = useState("");
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

  const getNextSevenDays = () => {
    const days = [];
    let i = 0;

    while (days.length < 7) {
      const day = dayjs().add(i, "day");
      if (day.day() !== 0) {
        days.push(day);
      }
      i++;
    }

    return days;
  };

  const [availableDates, setAvailableDates] = useState(getNextSevenDays());

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res.data);
      } catch (error) {
        console.log("Error fetching doctors:", error);
      }
    };

    const fetchPatientProfile = async () => {
      try {
        const profileData = await getProfilePatient();
        setPatientId(profileData.data.patientId);
        console.log("Patient ID fetched: ", profileData.data.patientId);
      } catch (error) {
        console.error("Error fetching patient profile:", error);
      }
    };

    fetchDoctors();
    fetchPatientProfile();
  }, []);

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setModalIsOpen(true);
    setAvailableTimeSlots(timeSlots);
    setAppointmentDate("");
    setTimeSlot("");
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedDoctor(null);
  };

  const handleDateSelect = async (date) => {
    setAppointmentDate(date);

    if (selectedDoctor && date) {
      try {
        const unavailableSlots = await getUnavailableTimeSlots(
          selectedDoctor._id,
          date
        );

        const now = dayjs();
        const selectedDate = dayjs(date);

        const filteredSlots = timeSlots.filter((slot) => {
          const [startTime] = slot.split(" - ");
          const slotTime = dayjs(`${date} ${startTime}`, "YYYY-MM-DD hh:mm A");

          // Filter out slots that are either unavailable or in the past
          return !unavailableSlots.includes(slot) && (selectedDate.isAfter(now, "day") || slotTime.isAfter(now));
        });

        setAvailableTimeSlots(filteredSlots);
      } catch (error) {
        console.error("Error fetching time slot availability:", error);
        toast.error("Error fetching time slots. Please try again later.");
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const appointmentData = {
        doctorId: selectedDoctor._id,
        patientId: patientId,
        appointmentDate,
        timeSlot,
      };
      await createAppointment(appointmentData);
      closeModal();
      toast.success("Appointment scheduled successfully");
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Error scheduling appointment");
    }
  };

  return (
    <div className="doctor-grid">
      {doctors.map((doctor) => (
        <div key={doctor._id} className="doctor-card">
          <div className="image-container">
            <img
              src={`http://localhost:5000/src/assets/doctorProfile/${doctor.profilePhoto}`}
              alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
              className="doctor-image"
            />
            <div className="overlay">
              <button className="appointment-btn" onClick={() => openModal(doctor)}>
                Get Appointment
              </button>
            </div>
          </div>
          <div className="doctor-details">
            <h3>Dr. {doctor.firstName} {doctor.lastName}</h3>
            <p>{doctor.specialization}</p>
            {doctor.aboutDoctor && doctor.aboutDoctor.length ? (
              <p>{doctor.aboutDoctor}</p>
            ) : null}
          </div>
        </div>
      ))}

      {/* Modal for scheduling appointment */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="appointment-modal" overlayClassName="appointment-modal-overlay">
        <h2>
          Schedule Appointment with <br /> Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
        </h2>

        {/* Date selection */}
        <div className="form-group date-picker">
          <label>Select Date:</label>
          <div className="date-options">
            {availableDates.map((day, index) => (
              <button
                key={index}
                className={`date-btn ${appointmentDate === day.format("YYYY-MM-DD") ? "selected" : ""}`}
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
              const [startTime] = slot.split(" - ");
              const slotTime = dayjs(`${appointmentDate} ${startTime}`, "YYYY-MM-DD hh:mm A");
              const isPast = slotTime.isBefore(dayjs());

              return (
                <button
                  key={slot}
                  className={`time-slot-btn ${timeSlot === slot ? "selected" : ""} ${isUnavailable || isPast ? "unavailable" : ""}`}
                  onClick={() => !isUnavailable && !isPast && setTimeSlot(slot)}
                  disabled={isUnavailable || isPast} // Disable button if unavailable or in the past
                >
                  {slot} {isPast ? " (Past)" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button className="submit-btn" onClick={handleSubmit}>
          Schedule Appointment
        </button>
        <button className="cancel-btn" onClick={closeModal}>
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default DoctorProfiles;
