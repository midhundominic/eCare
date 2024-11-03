import React from "react";

import Button from "../../Common/Button";
import styles from "./appointment.module.css";

const EventPopover = (props) => {
  const { handleMarkAbsent, handleStartConsultation, appointment } = props;
  const {
    title,
    extendedProps: { _id, patientDetails },
  } = JSON.parse(appointment);

  return (
    <div className={styles.popoverRoot}>
      <span>{title}</span>
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
    </div>
  );
};

export default EventPopover;
