import React from "react";
import Button from "../../Common/Button";
import styles from "./appointment.module.css";

const EventPopover = (props) => {
  const { 
    handleMarkAbsent, 
    handleStartConsultation, 
    handleUpdatePrescription,
    appointment 
  } = props;

  const {
    title,
    extendedProps: { _id, status },
  } = JSON.parse(appointment);

  const isCompleted = status === "completed";

  return (
    <div className={styles.popoverRoot}>
      <span>{title}</span>
      {isCompleted ? (
        <Button
          onClick={() => handleUpdatePrescription(_id)}
          styles={{ btnPrimary: styles.updateBtn }}
        >
          Update Prescription
        </Button>
      ) : (
        <>
          <Button
            onClick={() => handleMarkAbsent(_id)}
            styles={{ btnPrimary: styles.absentBtn }}
          >
            Mark Absent
          </Button>
          <Button
            onClick={() => handleStartConsultation(_id)}
            styles={{ btnPrimary: styles.startBtn }}
          >
            Start
          </Button>
        </>
      )}
    </div>
  );
};

export default EventPopover;