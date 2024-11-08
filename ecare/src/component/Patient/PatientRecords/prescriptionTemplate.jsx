import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Logo from "../../../assets/images/logo.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "2pt solid #2c3e50",
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 50,
  },
  title: {
    fontSize: 24,
    color: "#2c3e50",
    fontWeight: "bold",
  },
  patientInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  doctorInfo: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2c3e50",
    backgroundColor: "#edf2f7",
    padding: 5,
  },
  medicineItem: {
    marginBottom: 5,
    paddingLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    borderTop: "1pt solid #cbd5e0",
    paddingTop: 10,
  },
});

const PrescriptionTemplate = ({ prescription, doctor, patient }) => {
  // Add default values and null checks
  const doctorName = doctor
    ? `${doctor.firstName || ""} ${doctor.lastName || ""}`
    : "N/A";
  const doctorSpecialization = doctor?.specialization || "N/A";
  const registrationNumber = doctor?.registrationNumber || "N/A";
  const patientName = patient?.name || "N/A";
  const patientAge = patient?.age || "N/A";
  const patientGender = patient?.gender || "N/A";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={Logo} style={styles.logo} />
          <Text style={styles.title}>E-Care Solutions</Text>
        </View>

        <View style={styles.patientInfo}>
          <Text>Patient Name: {patientName}</Text>
          <Text>
            Age/Gender: {patientAge} years / {patientGender}
          </Text>
          <Text>Date: {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.doctorInfo}>
          <Text>Dr. {doctorName}</Text>
          <Text>{doctorSpecialization}</Text>
          <Text>Reg. No: {registrationNumber}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicines</Text>
          {prescription?.medicines?.map((med, index) => (
            <View key={index} style={styles.medicineItem}>
              <Text>
                {med.medicine?.name || "N/A"} - {med.frequency || "N/A"} for{" "}
                {med.days || 0} days
                {med.beforeFood ? " (Before Food)" : " (After Food)"}
                {med.isSOS ? " (SOS)" : ""}
              </Text>
            </View>
          ))}
        </View>

        {prescription?.tests?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tests Prescribed</Text>
            {prescription.tests.map((test, index) => (
              <View key={index} style={styles.medicineItem}>
                <Text>{test.testName || "N/A"}</Text>
              </View>
            ))}
          </View>
        )}

        {prescription?.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.medicineItem}>{prescription.notes}</Text>
          </View>
        )}

        {/* <View style={styles.footer}>
          <Text>Digital Signature</Text>
          <Text>Dr. {doctorName}</Text>
        </View> */}
      </Page>
    </Document>
  );
};

export default PrescriptionTemplate;
