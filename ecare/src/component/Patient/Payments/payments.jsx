import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button, CircularProgress, Paper } from '@mui/material';
import { getPatientPayments } from '../../../services/paymentServices';
import styles from './payments.module.css';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const res = await getPatientPayments(userData?.userId);
        setPayments(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const downloadPDF = (payment) => {
    const doc = new jsPDF();
    doc.text(`E-Care Payment Receipt`, 20, 20);
    doc.text(`Payment ID: ${payment._id}`, 20, 30);
    doc.text(`Amount: ₹${payment.amount}`, 20, 40);
    doc.text(`Payment Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Time: ${new Date(payment.createdAt).toLocaleTimeString()}`, 20, 60);
    doc.save(`E-Care_Receipt_${payment._id}.pdf`);
  };

  if (loading) return <CircularProgress />;

  return (
    <div className={styles.paymentContainer}>
      <h1>Payment History</h1>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        payments.map((payment) => (
          <Paper key={payment._id} className={styles.paymentCard}>
            <p><strong>Payment ID:</strong> {payment._id}</p>
            <p><strong>Amount:</strong> ₹{payment.amount}</p>
            <p><strong>Date:</strong> {new Date(payment.createdAt).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {new Date(payment.createdAt).toLocaleTimeString()}</p>
            <Button 
              variant="contained"
              name="download" 
              color="primary" 
              onClick={() => downloadPDF(payment)}
            >
              Download PDF
            </Button>
          </Paper>
        ))
      )}
    </div>
  );
};

export default Payments;
