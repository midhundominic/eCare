import React, { useEffect, useState } from "react";
import "./appointment.css";
import { getDoctors } from "../../../services/doctorServices";
import { useNavigate } from "react-router-dom";


const DoctorProfiles = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  // Fetch doctors' data from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await getDoctors();
        setDoctors(res.data);
      } catch (error) {
        console.log("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleGetAppointment = (doctorId) => {
    console.log("Navigating to schedule appointment with doctor ID:", doctorId);
    navigate(`/doctor/schedule/appointment/${doctorId}`);
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
              <button
                className="appointment-btn"
                onClick={()=>handleGetAppointment(doctor._id)}
              >
                Get Appointment
              </button>
            </div>
          </div>
          <div className="doctor-details">
            <h3>{`Dr. ${doctor.firstName} ${doctor.lastName}`}</h3>
            <p>{doctor.specialization}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorProfiles;
