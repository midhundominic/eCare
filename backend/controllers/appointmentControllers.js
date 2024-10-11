const AppointmentModel = require("../models/appointmentModel");

// Create a new appointment
const createAppointment = async (req, res) => {
  const { patientId, doctorId, appointmentDate, timeSlot } = req.body;

  if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the requested time slot for the doctor is already booked on the specified date
    const existingAppointment = await AppointmentModel.findOne({
      doctorId,
      appointmentDate,
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    // Check if the date is in the future and not in the past
    const now = new Date();
    const requestedDate = new Date(appointmentDate);
    if (
      requestedDate < now ||
      (requestedDate.getDate() === now.getDate() &&
        requestedDate.getTime() < now.getTime())
    ) {
      return res
        .status(400)
        .json({ message: "Cannot schedule appointment for past time" });
    }

    // Create new appointment if the slot is free and the date is valid
    const newAppointment = new AppointmentModel({
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
    });

    await newAppointment.save();
    res
      .status(201)
      .json({ message: "Appointment scheduled successfully", newAppointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUnavailableTimeSlots = async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ message: "Doctor ID and date are required" });
  }

  try {
    // Find all appointments for the doctor on the given date
    const appointments = await AppointmentModel.find({
      doctorId,
      appointmentDate: new Date(date),
    });

    // Extract the unavailable time slots
    const unavailableSlots = appointments.map(
      (appointment) => appointment.timeSlot
    );

    res.status(201).json({ unavailableSlots });
  } catch (error) {
    console.error("Error fetching unavailable time slots:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createAppointment, getUnavailableTimeSlots };
