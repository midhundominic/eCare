import React, { useEffect, useState } from "react";
import {
  getPrescriptionHistory,
  downloadTestResult,
} from "../../../services/prescriptionServices";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";
import styles from "./patientRecords.module.css";

const PatientRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const patientId = userData?.userId;
        if (!patientId) return;

        const response = await getPrescriptionHistory(patientId);
        setRecords(response.data);
      } catch (error) {
        toast.error("Error fetching patient records");
      }
    };
    fetchRecords();
  }, []);

  const handleDownloadResult = async (testResultId) => {
    try {
      await downloadTestResult(testResultId);
    } catch (error) {
      toast.error("Error downloading test result");
    }
  };

  return (
    <div className={styles.recordsContainer}>
      <h2>Medical Records</h2>
      {records.map((record) => (
        <Accordion key={record._id} className={styles.recordAccordion}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className={styles.summaryContent}>
              <span>{dayjs(record.createdAt).format("DD MMM YYYY")}</span>
              <span>Dr. {record.doctorId.firstName} {record.doctorId.lastName} - {record.doctorId.specialization}</span>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className={styles.prescriptionDetails}>
              <div className={styles.section}>
                <h3>Medicines</h3>
                <ul>
                  {record.medicines.map((medicine, idx) => (
                    <li key={idx}>
                      <span>{medicine.medicine?.name}</span>
                      <span>
                        {medicine.frequency} for {medicine.days} days
                      </span>
                      <span>
                        {medicine.beforeFood ? "Before food" : "After food"}
                      </span>
                      {medicine.isSOS && <span>(SOS)</span>}
                    </li>
                  ))}
                </ul>
              </div>

              {record.tests.length > 0 && (
                <div className={styles.section}>
                  <h3>Tests</h3>
                  <ul>
                    {record.tests.map((test, idx) => (
                      <li key={idx} className={styles.testItem}>
                        <span>{test.testName}</span>
                        {test.resultId ? (
                          <Button
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadResult(test.resultId)}
                            variant="contained"
                            size="small"
                          >
                            Download Result
                          </Button>
                        ) : (
                          <span className={styles.pendingResult}>
                            Result not available
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {record.notes && (
                <div className={styles.section}>
                  <h3>Notes</h3>
                  <p>{record.notes}</p>
                </div>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default PatientRecords;
