import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import styles from './laboratoryResult.module.css';
import { getCompletedTests, updateTestResult, downloadTestResult } from '../../../services/prescriptionServices';

const LaboratoryResult = () => {
  const [completedTests, setCompletedTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [newRemarks, setNewRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompletedTests();
  }, []);

  const fetchCompletedTests = async () => {
    try {
      const response = await getCompletedTests();
      setCompletedTests(response.data);
    } catch (error) {
      toast.error('Error fetching completed tests');
    }
  };

  const handleEdit = async () => {
    try {
      setLoading(true);
      await updateTestResult(selectedTest.resultId, { remarks: newRemarks });
      toast.success('Test result updated successfully');
      setEditDialogOpen(false);
      fetchCompletedTests();
    } catch (error) {
      toast.error('Error updating test result');
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

  return (
    <div className={styles.completedTestsContainer}>
      <Typography variant="h4" className={styles.title}>
        Completed Laboratory Tests
      </Typography>

      <Paper className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Remarks</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {completedTests.map((test) => (
              <TableRow key={test.resultId}>
                <TableCell>{test.patientName}</TableCell>
                <TableCell>{test.testName}</TableCell>
                <TableCell>
                  {new Date(test.uploadDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{test.remarks}</TableCell>
                <TableCell className={styles.actionButtons}>
                  <Button
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      setSelectedTest(test);
                      setViewDialogOpen(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setSelectedTest(test);
                      setNewRemarks(test.remarks);
                      setEditDialogOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(test.resultId)}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Test Result</DialogTitle>
        <DialogContent>
          <Box className={styles.editContent}>
            <Typography variant="h6" gutterBottom>
              Test Details
            </Typography>
            <Typography><strong>Patient:</strong> {selectedTest?.patientName}</Typography>
            <Typography><strong>Test:</strong> {selectedTest?.testName}</Typography>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              label="Remarks"
              fullWidth
              value={newRemarks}
              onChange={(e) => setNewRemarks(e.target.value)}
              className={styles.remarksField}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleEdit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>View Test Result</DialogTitle>
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
            onClick={() => handleDownload(selectedTest?.resultId)}
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

export default LaboratoryResult;
