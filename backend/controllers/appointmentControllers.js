const AppointmentModel = require("../models/appointmentModel");
const PatientModel = require("../models/patientModel");
const DoctorModel = require("../models/doctorModel");
const DoctorLeave = require("../models/doctorLeaveModel");
const { sendEmail } = require("../services/emailservice");

// Create a new appointment
// Create a new appointment
const createAppointment = async (req, res) => {
  const { patientId, doctorId, appointmentDate, timeSlot } = req.body;

  if (!patientId || !doctorId || !appointmentDate || !timeSlot) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the doctor is on leave on the selected appointment date
    const doctorLeave = await DoctorLeave.findOne({
      doctorId,
      leaveDate: new Date(appointmentDate),
      status: "approved",
    });

    if (doctorLeave) {
      return res.status(400).json({ message: "Doctor is on leave on the selected date" });
    }

    // Check if the requested time slot for the doctor is already booked on the specified date
    const existingAppointment = await AppointmentModel.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      status: { $ne: "canceled" },
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    // Ensure the appointment is in the future
    const now = new Date();
    const selectedDate = new Date(appointmentDate);
    const [startTime, endTime] = timeSlot.split(" - ");

    const selectedStartTime = new Date(`${appointmentDate} ${startTime}`);
    const selectedEndTime = new Date(`${appointmentDate} ${endTime}`);

    if (selectedDate.toDateString() === now.toDateString() && selectedStartTime <= now) {
      return res.status(400).json({
        message: "You cannot book an appointment for a past time slot.",
      });
    }

    // Create the appointment
    const newAppointment = new AppointmentModel({
      patientId,
      doctorId,
      appointmentDate,
      timeSlot,
    });

    await newAppointment.save();
    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




const getUnavailableTimeSlots = async (req, res) => {
  const { doctorId, date } = req.query;

  if (!doctorId || !date) {
    return res.status(400).json({ message: "Doctor ID and date are required" });
  }

  try {
    // Check if the doctor is on leave on the given date
    const leaveOnDate = await DoctorLeave.findOne({
      doctorId,
      leaveDate: new Date(date),
      status: "approved",
    });

    if (leaveOnDate) {
      return res.status(201).json({
        message: "Doctor is on approved leave on this date.",
        unavailable: true,
        unavailableSlots: [], // No time slots available on leave days
      });
    }

    // If the doctor is not on leave, proceed to find unavailable time slots from appointments
    const appointments = await AppointmentModel.find({
      doctorId,
      appointmentDate: new Date(date),
      status: { $ne: "canceled" },
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


const getAppointmentsByPatientId = async (req, res) => {
  const { patientId } = req.params;

  try {
    const appointments = await AppointmentModel.find({ patientId }).populate(
      "doctorId",
      "firstName lastName specialization"
    );
    res.status(201).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel an appointment
const cancelAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // Delete the appointment instead of marking it as "canceled"
    await appointment.deleteOne();

    // appointment.status = "canceled";
    // await appointment.save();

    const patient = await PatientModel.findById(appointment.patientId);
    const doctor = await DoctorModel.findById(appointment.doctorId);
    const message = `Dear ${patient.name}, your appointment scheduled to the Dr. ${doctor.firstName} ${doctor.lastName} for ${appointment.appointmentDate} at ${appointment.timeSlot} has been canceled`;
    sendEmail(patient.email, "Appointment Canceled", message);

    res.status(201).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error("Error canceling appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reschedule an appointment
const rescheduleAppointment = async (req, res) => {
  const { appointmentId } = req.params;
  const { appointmentDate, timeSlot } = req.body;

  try {
    const appointment = await AppointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if doctor is on leave on the selected date
    const doctorLeave = await DoctorLeave.findOne({
      doctorId: appointment.doctorId,
      leaveDate: appointmentDate,
    });

    if (doctorLeave) {
      return res.status(400).json({ message: "Doctor is on leave on the selected date" });
    }

    // Check if the new time slot is available
    const existingAppointment = await AppointmentModel.findOne({
      doctorId: appointment.doctorId,
      appointmentDate,
      timeSlot,
    });

    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    // Update appointment details
    appointment.appointmentDate = appointmentDate;
    appointment.timeSlot = timeSlot;
    appointment.status = "rescheduled";
    await appointment.save();

    const patient = await PatientModel.findById(appointment.patientId);
    const doctor = await DoctorModel.findById(appointment.doctorId);
    const message = `Dear ${patient.name}, your appointment with Dr. ${doctor.firstName} ${doctor.lastName} has been rescheduled to ${appointmentDate} at ${timeSlot}.`;
    sendEmail(patient.email, "Appointment Rescheduled", message);

    res.status(201).json({ message: "Appointment rescheduled successfully" });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({})
      .populate("patientId", "name email")
      .populate("doctorId", "firstName lastName specialization");
    res.status(201).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createAppointment,
  getUnavailableTimeSlots,
  getAppointmentsByPatientId,
  cancelAppointment,
  rescheduleAppointment,
  getAllAppointments,
};
