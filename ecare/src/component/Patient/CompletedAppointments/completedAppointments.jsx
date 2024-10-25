import React, { useState, useEffect } from 'react';
import { getCompletedAppointments, submitReview } from '../../../services/appointmentServices';
import { toast } from 'react-toastify';

const CompletedAppointments = () => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const patientId = userData?.userId;

      if (!patientId) return;

      const res = await getCompletedAppointments(patientId);
      setCompletedAppointments(res?.data?.appointments || []);
    };

    fetchCompletedAppointments();
  }, []);

  const handleReviewSubmit = async (appointmentId, doctorId) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const patientId = userData?.userId; // Retrieve patientId from local storage
  
    if (!patientId) {
      toast.error("Patient ID not found");
      return;
    }
  
    try {
      await submitReview(appointmentId, doctorId, patientId, rating, review);
      toast.success("Review submitted successfully");
    } catch (error) {
      toast.error("Error submitting review");
    }
  };
  

  return (
    <div className="completed-appointments-list">
      <h2>Completed Appointments</h2>
      {completedAppointments.length ? (
        completedAppointments.map((appointment) => (
          <div key={appointment._id} className="appointment-card">
            <p>Doctor: Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}</p>
            <p>Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            <div>
              <label>Rating:</label>
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 && 's'}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Write your review here"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button onClick={() => handleReviewSubmit(appointment._id, appointment.doctorId._id)}>
              Submit Review
            </button>
          </div>
        ))
      ) : (
        <p>No completed appointments to show.</p>
      )}
    </div>
  );
};

export default CompletedAppointments;