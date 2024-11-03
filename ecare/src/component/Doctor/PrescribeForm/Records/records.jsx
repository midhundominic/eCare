import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";

import styles from "./records.module.css";
import { getCompletedAppointments } from "../../../../services/appointmentServices";

const PatientRecords = ({ patient }) => {
  const [appointments, setAppointments] = useState([]);
  console.log(patient, "111111111-patient");

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      const patientId = patient._id;

      if (!patientId) return;

      const res = await getCompletedAppointments(patientId);
      console.log(res?.data?.appointments, "55555555555");
      setAppointments(res?.data?.appointments || []);
    };

    fetchCompletedAppointments();
  }, []);

  return (
    <div className={styles.recordRoot}>
      {appointments.map((booking) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              {dayjs(booking.appointmentDate).format("DD-MM-YYYY")}
            </AccordionSummary>
            <AccordionDetails>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
};

export default PatientRecords;
