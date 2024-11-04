import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography, Chip, Box, Divider } from "@mui/material";
import dayjs from "dayjs";

import styles from "./records.module.css";
import { getPrescriptionHistory } from "../../../../services/doctorServices";

const PatientRecords = ({ patient }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      const patientId = patient._id;
      if (!patientId) return;

      try {
        const res = await getPrescriptionHistory(patientId);
        setAppointments(res?.data?.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchCompletedAppointments();
  }, [patient]);

  const renderMedicines = (medicines) => (
    <div className={styles.medicineSection}>
      <Typography variant="subtitle2" className={styles.sectionTitle}>
        Medicines Prescribed
      </Typography>
      {medicines.map((med, index) => (
        <Box key={index} className={styles.medicineItem}>
          <Typography variant="body2">
            {med.medicine?.name || 'Unknown Medicine'} - {med.frequency || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {med.days || 0} days {med.beforeFood ? '(Before Food)' : '(After Food)'} 
            {med.isSOS && <Chip size="small" label="SOS" color="warning" />}
          </Typography>
        </Box>
      ))}
    </div>
  );

  const renderTests = (tests) => (
    <div className={styles.testSection}>
      <Typography variant="subtitle2" className={styles.sectionTitle}>
        Tests Prescribed
      </Typography>
      {tests.map((test, index) => (
        <Box key={index} className={styles.testItem}>
          <Typography variant="body2">{test.testName}</Typography>
          {test.isCompleted ? (
            <Chip 
              size="small" 
              label="Completed" 
              color="success"
              onClick={() => handleViewResult(test.resultId)}
            />
          ) : (
            <Chip size="small" label="Pending" color="default" />
          )}
        </Box>
      ))}
    </div>
  );

  return (
    <div className={styles.recordRoot}>
      {appointments.map((appointment) => (
        <Accordion key={appointment._id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {dayjs(appointment.appointmentDate).format("DD MMM YYYY")}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {appointment.prescription ? (
              <div className={styles.prescriptionDetails}>
                {appointment.prescription.medicines?.length > 0 && 
                  renderMedicines(appointment.prescription.medicines)}
                
                <Divider className={styles.divider} />
                
                {appointment.prescription.tests?.length > 0 && 
                  renderTests(appointment.prescription.tests)}
                
                {appointment.prescription.notes && (
                  <>
                    <Divider className={styles.divider} />
                    <div className={styles.notesSection}>
                      <Typography variant="subtitle2" className={styles.sectionTitle}>
                        Notes
                      </Typography>
                      <Typography variant="body2">
                        {appointment.prescription.notes}
                      </Typography>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Typography color="textSecondary">
                No prescription available for this appointment
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default PatientRecords;