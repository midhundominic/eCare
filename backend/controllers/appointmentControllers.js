const Appointment = require("../models/appointmentModel");

// Schedule an appointment
const scheduleAppointment = async (req, res) => {
  const { patientId, doctorId, appointmentDate } = req.body;

  try {
    const newAppointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment scheduled successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error scheduling appointment", error });
  }
};

// Reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  const { appointmentId, newDate } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { appointmentDate: newDate, status: 'rescheduled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(201).json({
      message: "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error rescheduling appointment", error });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status: 'canceled' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(201).json({
      message: "Appointment canceled successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error canceling appointment", error });
  }
};

module.exports = {
  scheduleAppointment,
  rescheduleAppointment,
  cancelAppointment,
};
