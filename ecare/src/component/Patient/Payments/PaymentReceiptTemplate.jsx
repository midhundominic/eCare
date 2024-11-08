import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import Logo from '../../../assets/images/logo.png';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '2pt solid #2c3e50',
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 50,
  },
  title: {
    fontSize: 24,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  receiptBox: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1pt solid #edf2f7',
  },
  label: {
    color: '#4a5568',
  },
  value: {
    color: '#2d3748',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#718096',
    fontSize: 10,
  },
});

const PaymentReceiptTemplate = ({ payment }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src={Logo} style={styles.logo} />
        <Text style={styles.title}>E-Care Solutions</Text>
      </View>

      <View style={styles.receiptBox}>
        <Text style={styles.receiptTitle}>Payment Receipt</Text>
        
        <View style={styles.row}>
          <Text style={styles.label}>Transaction ID:</Text>
          <Text style={styles.value}>{payment._id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Amount Paid:</Text>
          <Text style={styles.value}>₹{payment.amount}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Date:</Text>
          <Text style={styles.value}>
            {new Date(payment.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Time:</Text>
          <Text style={styles.value}>
            {new Date(payment.createdAt).toLocaleTimeString()}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>This is a computer-generated receipt and does not require a signature.</Text>
        <Text>Thank you for choosing E-Care Solutions</Text>
      </View>
    </Page>
  </Document>
);

export default PaymentReceiptTemplate;