import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDoctorById } from '../../../services/doctorServices';
import { scheduleAppointment } from "../../../api/appointment"

const ScheduleAppointment = () => {
  const { id } = useParams(); // Get the doctor ID from the URL
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch doctor details based on ID
  useEffect(() => {
    console.log("Loaded ScheduleAppointment for doctor ID:", id);
    if (!id) {
        setError('Doctor ID is missing');
        return;
      }

    const fetchDoctor = async () => {
      try {
        const res = await getDoctorById(id); // Fetch the doctor by ID
        setDoctor(res);
      } catch (error) {
        console.error("Error fetching doctor:", error);
        setError('Error fetching doctor details.');
      }
    };

    fetchDoctor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !timeSlot) {
      setError('Please select both a date and time slot.');
      return;
    }

    const appointmentData = {
      doctorId: doctor._id,
      patientId: localStorage.getItem('patientId'), // Assuming patientId is stored in localStorage after login
      appointmentDate: date,
      timeSlot,
    };

    try {
      const res = await scheduleAppointment(appointmentData); // Make sure `scheduleAppointment` is implemented
      if (res) {
        alert('Appointment scheduled successfully!');
        navigate('/patient/appointments'); // Adjust route as necessary
      } else {
        setError('Failed to schedule the appointment.');
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setError('Error scheduling appointment. Please try again later.');
    }
  };

  const timeSlots = [
    "9:00 AM - 9:15 AM", "9:15 AM - 9:30 AM", "9:30 AM - 10:00 AM",
    "10:00 AM - 10:15 AM", "10:15 AM - 10:30 AM", "11:00 AM - 11:15 AM",
    "11:15 AM - 11:30 AM", "11:30 AM - 11:45 AM", "11:45 AM - 12:00 PM",
    "12:00 PM - 12:15 PM", "12:15 PM - 12:30 PM"
  ];

  if (!doctor && !error) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  return (
    <div className="schedule-appointment">
      {error && <div className="error">{error}</div>}
      {doctor && (
        <>
          <h2>
            Schedule Appointment with Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
          </h2>

          <form onSubmit={handleSubmit}>
            <label>
              Date:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Time Slot:
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                required
              >
                <option value="">Select a time slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <button type="submit">Schedule Appointment</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ScheduleAppointment;
