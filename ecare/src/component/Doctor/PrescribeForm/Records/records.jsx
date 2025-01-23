import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography, Chip, Box, Divider, Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

import styles from "./records.module.css";
import { getPrescriptionHistory, downloadTestResult } from "../../../../services/prescriptionServices";

const PatientRecords = ({ patient }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient?._id) {
      fetchPrescriptionHistory();
    }
  }, [patient]);

  const fetchPrescriptionHistory = async () => {
    try {
      const response = await getPrescriptionHistory(patient._id);
      setPrescriptions(response.data);
    } catch (error) {
      toast.error('Error fetching prescription history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resultId) => {
    try {
      await downloadTestResult(resultId);
    } catch (error) {
      toast.error('Error downloading test result');
    }
  };

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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.recordsContainer}>
      <Typography variant="h5" className={styles.title}>
        Test Results History
      </Typography>

      <Paper className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Laboratory Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((prescription) => (
              prescription.tests.map((test) => (
                test.resultId && (
                  <TableRow key={test.resultId._id}>
                    <TableCell>
                      {new Date(test.resultId.uploadDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{test.testName}</TableCell>
                    <TableCell>
                      {`Dr. ${prescription.doctorId.firstName} ${prescription.doctorId.lastName}`}
                    </TableCell>
                    <TableCell>{test.resultId.remarks}</TableCell>
                    <TableCell className={styles.actionButtons}>
                      <Button
                        startIcon={<VisibilityIcon />}
                        onClick={() => {
                          setSelectedTest(test.resultId);
                          setViewDialogOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(test.resultId._id)}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              ))
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Test Result</DialogTitle>
        <DialogContent>
          <Box className={styles.viewContent}>
            <iframe
              src={selectedTest?.resultFileUrl}
              title="Test Result"
              width="100%"
              height="500px"
              className={styles.pdfViewer}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            onClick={() => handleDownload(selectedTest?._id)}
            variant="contained" 
            color="primary"
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PatientRecords;