import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import styles from './prescriptionPayment.module.css';
import Button from '../../Common/Button';
import { createPrescriptionPayment, verifyPrescriptionPayment, getPrescriptionPaymentStatus } from '../../../services/prescriptionPaymentServices';
import { getPrescriptionById } from '../../../services/prescriptionServices';
import { usePatient } from '../../../context/patientContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const PrescriptionPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { patient } = usePatient();
  
  // Get prescription from location state or localStorage
  const prescriptionFromState = location.state?.prescription;
  const prescriptionFromStorage = JSON.parse(localStorage.getItem('currentPrescription'));
  
  const [prescription, setPrescription] = useState(prescriptionFromState || prescriptionFromStorage || null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [insufficientStock, setInsufficientStock] = useState([]);
  
  useEffect(() => {
    // If we don't have prescription data, redirect back to home
    if (!prescription) {
      toast.error('Prescription details not found');
      navigate('/patient/home');
      return;
    }
    
    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        const paymentStatusResponse = await getPrescriptionPaymentStatus(prescription._id);
        if (paymentStatusResponse.success && paymentStatusResponse.data.isPaid) {
          setPaymentDetails(paymentStatusResponse.data);
          // If already paid, redirect to prescription details
          toast.info('Prescription has already been paid for');
          navigate('/patient/prescription-details', { state: { prescription: prescription } });
        }
      } catch (error) {
        // Payment might not exist yet, which is fine
        console.log('Payment not found, will create new payment');
      }
    };
    
    checkPaymentStatus();
  }, [prescription, navigate]);
  
  const handlePayNow = async () => {
    try {
      setIsLoading(true);
      
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      const patientId = userData?.userId;
      
      if (!patientId) {
        toast.error('Patient ID is missing. Please log in again.');
        return;
      }
      
      // Create payment
      const paymentResponse = await createPrescriptionPayment(prescription._id, patientId);
      
      if (!paymentResponse.success) {
        if (paymentResponse.insufficientStock) {
          setInsufficientStock(paymentResponse.insufficientStock);
          setShowPaymentDialog(true);
        } else {
          toast.error(paymentResponse.message || 'Error creating payment');
        }
        setIsLoading(false);
        return;
      }
      
      setPaymentDetails(paymentResponse.data);
      
      // Load Razorpay script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Please try again later.');
        setIsLoading(false);
        return;
      }
      
      // Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_EYA3vypm9ZHRuN',
        amount: paymentResponse.data.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'eCare Prescription',
        description: 'Payment for medicines and lab tests',
        order_id: paymentResponse.data.orderId,
        handler: async function (response) {
          try {
            const verifyResponse = await verifyPrescriptionPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              prescriptionPaymentId: paymentResponse.data.paymentId
            });
            
            if (verifyResponse.success) {
              toast.success('Payment successful! Medicines and tests are now available.');
              navigate('/patient/prescription-details', { state: { prescription: prescription } });
            } else {
              toast.error('Payment verification failed: ' + verifyResponse.message);
            }
          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error('Error processing payment: ' + (error.response?.data?.message || error.message));
          }
        },
        prefill: {
          name: patient?.name || 'Patient',
          email: patient?.email || '',
          contact: patient?.phone || '',
        },
        theme: {
          color: '#3399cc',
        },
      };
      
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Error initiating payment: ' + (error.response?.data?.message || error.message));
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
        <p>Loading payment details...</p>
      </div>
    );
  }
  
  if (!prescription) {
    return (
      <div className={styles.errorContainer}>
        <p>Prescription not found or error loading details.</p>
        <Button onClick={() => navigate('/patient/prescriptions')}>
          Back to Prescriptions
        </Button>
      </div>
    );
  }
  
  return (
    <div className={styles.paymentContainer}>
      <h2>Prescription Payment</h2>
      
      <div className={styles.prescriptionDetails}>
        <h3>Prescription Details</h3>
        <p><strong>Doctor:</strong> Dr. {prescription.doctorId?.firstName} {prescription.doctorId?.lastName}</p>
        <p><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className={styles.medicinesSection}>
        <h3>Medicines</h3>
        {prescription.medicines && prescription.medicines.length > 0 ? (
          <ul className={styles.medicinesList}>
            {prescription.medicines.map((med, index) => (
              <li key={index} className={styles.medicineItem}>
                <span className={styles.medicineName}>{med.medicine?.name}</span>
                <span className={styles.medicineDetails}>
                  {med.frequency}, {med.days} days
                  {med.beforeFood ? ', before food' : ''}
                  {med.isSOS ? ', SOS' : ''}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No medicines prescribed</p>
        )}
      </div>
      
      <div className={styles.testsSection}>
        <h3>Lab Tests</h3>
        {prescription.tests && prescription.tests.length > 0 ? (
          <ul className={styles.testsList}>
            {prescription.tests.map((test, index) => (
              <li key={index} className={styles.testItem}>
                {test.testName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No lab tests prescribed</p>
        )}
      </div>
      
      {paymentDetails && (
        <div className={styles.paymentSummary}>
          <h3>Payment Summary</h3>
          <p><strong>Total Amount:</strong> ₹{paymentDetails.amount.toFixed(2)}</p>
        </div>
      )}
      
      <div className={styles.actionButtons}>
        <Button 
          onClick={() => navigate('/patient/prescription-details', { state: { prescription: prescription } })}
          styles={{ btnSecondary: styles.backButton }}
        >
          Back
        </Button>
        <Button 
          onClick={handlePayNow}
          styles={{ btnPrimary: styles.payButton }}
          isDisabled={isLoading}
        >
          Pay Now
        </Button>
      </div>
      
      {/* Insufficient Stock Dialog */}
      <Dialog
        open={showPaymentDialog}
        onClose={() => setShowPaymentDialog(false)}
      >
        <DialogTitle>Insufficient Medicine Stock</DialogTitle>
        <DialogContent>
          <p>The following medicines don't have enough stock:</p>
          <ul>
            {insufficientStock.map((item, index) => (
              <li key={index}>
                <strong>{item.name}</strong>: Required {item.required}, Available {item.available}
              </li>
            ))}
          </ul>
          <p>Please contact the pharmacy or your doctor for alternatives.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPaymentDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PrescriptionPayment;