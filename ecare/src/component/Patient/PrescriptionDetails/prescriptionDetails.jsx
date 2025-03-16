import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress, Paper, Divider, Typography, Box, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import styles from './prescriptionDetails.module.css';
import Button from '../../Common/Button';
import { getPrescriptionById } from '../../../services/prescriptionServices';
import { getPrescriptionPaymentStatus } from '../../../services/prescriptionPaymentServices';
import { ROUTES } from '../../../router/routes';

const PrescriptionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get prescription from location state or localStorage
  const prescriptionFromState = location.state?.prescription;
  const prescriptionFromStorage = JSON.parse(localStorage.getItem('currentPrescription'));
  
  const [prescription, setPrescription] = useState(prescriptionFromState || prescriptionFromStorage || null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(!prescription);
  
  useEffect(() => {
    // If we don't have prescription data, redirect back to home
    if (!prescription) {
      toast.error('Prescription details not found');
      navigate('/patient/home');
      return;
    }
    
    // Fetch payment status
    const fetchPaymentStatus = async () => {
      try {
        const response = await getPrescriptionPaymentStatus(prescription._id);
        if (response.success) {
          setPaymentStatus(response.data);
        }
      } catch (error) {
        console.log('No payment found for this prescription yet');
      }
    };
    
    fetchPaymentStatus();
  }, [prescription, navigate]);
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  
  if (!prescription) {
    return (
      <div className={styles.errorContainer}>
        <Typography variant="h6">Prescription not found</Typography>
        <Button 
          onClick={() => navigate('/patient/home')}
          styles={{ btnSecondary: styles.backButton }}
        >
          Back to Home
        </Button>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className={styles.prescriptionContainer}>
      <Typography variant="h4" className={styles.pageTitle}>Prescription Details</Typography>
      
      <Paper elevation={3} className={styles.prescriptionCard}>
        <div className={styles.prescriptionHeader}>
          <div>
            <Typography variant="h6">Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}</Typography>
            <Typography variant="body2" color="textSecondary">{prescription.doctorId?.specialization}</Typography>
          </div>
          <div>
            <Typography variant="body2">Date: {formatDate(prescription.createdAt)}</Typography>
            <Typography variant="body2">Prescription ID: {prescription._id}</Typography>
          </div>
        </div>
        
        <Divider className={styles.divider} />
        
        {/* Payment Status Section */}
        {(!prescription.isPaid && !paymentStatus?.isPaid) && (
          <div className={styles.paymentAlert}>
            <p>Payment required to access medicines and lab tests</p>
            <Button 
              onClick={() => navigate('/patient/prescription-payment', { 
                state: { prescription: prescription }
              })}
              styles={{ btnPrimary: styles.payButton }}
            >
              Proceed to Payment
            </Button>
          </div>
        )}
        
        {(prescription.isPaid || paymentStatus?.isPaid) && (
          <div className={styles.paymentComplete}>
            <p>Payment completed on {formatDate(prescription.paymentDate || paymentStatus?.paymentDate)}</p>
          </div>
        )}
        
        {/* Medicines Section */}
        <div className={styles.sectionContainer}>
          <Typography variant="h6" className={styles.sectionTitle}>Medicines</Typography>
          
          {(prescription.isPaid || paymentStatus?.isPaid) ? (
            prescription.medicines && prescription.medicines.length > 0 ? (
              <div className={styles.medicinesList}>
                {prescription.medicines.map((med, index) => (
                  <Paper key={index} elevation={1} className={styles.medicineItem}>
                    <div className={styles.medicineName}>
                      <Typography variant="subtitle1">{med.medicine?.name}</Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip 
                          label={med.frequency} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={`${med.days} days`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        {med.beforeFood && (
                          <Chip 
                            label="Before food" 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        )}
                        {med.isSOS && (
                          <Chip 
                            label="SOS" 
                            size="small" 
                            color="error" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </div>
                    <div className={styles.medicineInstructions}>
                      <Typography variant="body2">
                        Take {med.frequency === 'OD' ? 'once' : 
                              med.frequency === 'BD' ? 'twice' : 
                              med.frequency === 'TID' ? 'three times' : 
                              med.frequency === 'QID' ? 'four times' : med.frequency} daily
                        {med.beforeFood ? ' before meals' : ' after meals'}
                        {med.isSOS ? ', as needed for symptoms' : ''}
                        {' for '}{med.days} days.
                      </Typography>
                    </div>
                  </Paper>
                ))}
              </div>
            ) : (
              <Typography variant="body1" className={styles.noItemsText}>No medicines prescribed</Typography>
            )
          ) : (
            <div className={styles.lockedSection}>
              <Typography variant="body1">Please complete payment to view prescribed medicines</Typography>
            </div>
          )}
        </div>
        
        {/* Lab Tests Section */}
        <div className={styles.sectionContainer}>
          <Typography variant="h6" className={styles.sectionTitle}>Lab Tests</Typography>
          
          {(prescription.isPaid || paymentStatus?.isPaid) ? (
            prescription.tests && prescription.tests.length > 0 ? (
              <div className={styles.testsList}>
                {prescription.tests.map((test, index) => (
                  <Paper key={index} elevation={1} className={styles.testItem}>
                    <div className={styles.testName}>
                      <Typography variant="subtitle1">{test.testName}</Typography>
                    </div>
                    <div className={styles.testStatus}>
                      {test.isCompleted ? (
                        <Chip 
                          label="Completed" 
                          color="success" 
                          size="small"
                        />
                      ) : (
                        <Chip 
                          label="Pending" 
                          color="warning" 
                          size="small"
                        />
                      )}
                      
                      {test.resultId && (
                        <Button 
                          onClick={() => navigate(`/download-result/${test.resultId}`)}
                          styles={{ btnSecondary: styles.viewResultButton }}
                        >
                          View Result
                        </Button>
                      )}
                    </div>
                  </Paper>
                ))}
              </div>
            ) : (
              <Typography variant="body1" className={styles.noItemsText}>No lab tests prescribed</Typography>
            )
          ) : (
            <div className={styles.lockedSection}>
              <Typography variant="body1">Please complete payment to view prescribed lab tests</Typography>
            </div>
          )}
        </div>
        
        {/* Doctor's Notes Section */}
        <div className={styles.sectionContainer}>
          <Typography variant="h6" className={styles.sectionTitle}>Doctor's Notes</Typography>
          <Paper elevation={1} className={styles.notesContainer}>
            <Typography variant="body1">
              {prescription.notes || "No additional notes from the doctor."}
            </Typography>
          </Paper>
        </div>
        
        <div className={styles.actionButtons}>
          <Button 
            onClick={() => navigate('/patient/home')}
            styles={{ btnSecondary: styles.backButton }}
          >
            Back to Home
          </Button>
          
          {(!prescription.isPaid && !paymentStatus?.isPaid) && (
            <Button 
              onClick={() => navigate('/patient/prescription-payment', { 
                state: { prescription: prescription }
              })}
              styles={{ btnPrimary: styles.payButton }}
            >
              Proceed to Payment
            </Button>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default PrescriptionDetails;