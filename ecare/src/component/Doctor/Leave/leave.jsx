import React, { useState, useEffect } from "react";
import { applyForLeave, fetchLeaveStatus } from "../../../services/doctorServices";
import { toast } from "react-toastify";

const ApplyLeave = () => {
  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("");

  // Fetch leave status when the component mounts
  useEffect(() => {
    const getLeaveStatus = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const doctorId = userData.doctorId;
      if (doctorId) {
        try {
          const status = await fetchLeaveStatus(doctorId);
          setLeaveStatus(status);
        } catch (error) {
          toast.error("Error fetching leave status");
        }
      }
    };
    getLeaveStatus();
  }, []);

  const handleSubmit = async () => {
    const selectedDate = new Date(leaveDate);
    const today = new Date();

    // Validate if the leave date is in the past
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      toast.error("You cannot apply for leave on a past date.");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData")); // Assuming you store doctorId
      const doctorId = userData.doctorId;
      if (!doctorId) {
        toast.error("Doctor ID not found");
        return;
      }

      await applyForLeave({ doctorId, leaveDate, reason });
      toast.success("Leave request submitted");
      // Fetch updated leave status
      const status = await fetchLeaveStatus(doctorId);
      setLeaveStatus(status);
    } catch (error) {
      toast.error("Error submitting leave request");
    }
  };

  return (
    <div>
      <h2>Apply for Leave</h2>
      <input
        type="date"
        value={leaveDate}
        onChange={(e) => setLeaveDate(e.target.value)}
      />
      <input
        type="text"
        placeholder="Reason for leave"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
      <h3>Leave Status: {leaveStatus || "No leave requested yet."}</h3>
    </div>
  );
};

export default ApplyLeave;
