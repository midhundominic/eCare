import React, { useEffect, useState } from 'react';
import { getPatientRecords } from '../../../services/patientServices';
import { toast } from 'react-toastify';

const PatientRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const patientId = userData?.userId;
        if (!patientId) return;

        const patientRecords = await getPatientRecords(patientId);
        setRecords(patientRecords);
      } catch (error) {
        toast.error('Error fetching patient records');
      }
    };
    fetchRecords();
  }, []);

  return (
    <div className="patient-records">
      <h2>My Medical Records</h2>
      {records.map((record, index) => (
        <div key={index} className="record-card">
          <h3>Consultation Date: {new Date(record.appointmentDate).toLocaleDateString()}</h3>
          <p>Doctor: Dr. {record.doctorId.firstName} {record.doctorId.lastName}</p>
          <h4>Prescription:</h4>
          <ul>
            {record.prescription.medicines.map((medicine, idx) => (
              <li key={idx}>{medicine.name} - {medicine.dosage}</li>
            ))}
          </ul>
          <h4>Tests:</h4>
          <ul>
            {record.prescription.tests.map((test, idx) => (
              <li key={idx}>
                {test.name}: {test.result ? test.result : 'Pending'}
              </li>
            ))}
          </ul>
          <p>Notes: {record.prescription.notes}</p>
        </div>
      ))}
    </div>
  );
};

export default PatientRecords;