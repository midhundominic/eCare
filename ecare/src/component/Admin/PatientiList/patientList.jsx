import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Table from "../../Common/Table";
import { HEAD_CELLS } from "./constant";
import { getPatients, deletePatient } from "../../../services/patientServices";
import Button from "../../Common/Button";
import { ROUTES } from "../../../router/routes";

import styles from "./patientList.module.css";
import PageTitle from "../../Common/PageTitle";

const PatientList = () => {
  const [patientArr, setPatientArr] = useState([]);
  const navigate = useNavigate();

  const formatData = (data) => {
    return data.map((patient, index) => {
      const { _id, name, email, personalInfo,dateOfBirth ,gender,weight,height,admissionNumber} = patient; // Include _id from patient
       // Handle cases where personalInfo is missing
  
      return {
        id: `${index}-${email}`, // Unique ID for the table row
        _id, // Include _id for deletion
        name,
        email,
        dateOfBirth: dateOfBirth || "N/A",
        gender: gender || "N/A",
        weight: weight || "N/A",
        height: height || "N/A",
        admissionNumber: admissionNumber || "N/A",
      };
    });
  };
  

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatients();
        const formattedData = formatData(response.data);
        setPatientArr(formattedData);
      } catch (error) {
        console.error("Error fetching Patients", error);
      }
    };

    fetchPatient();
  }, []);

  // Handle delete patient
  const handleDelete = async (selectedIds) => {
    try {
      await Promise.all(
        selectedIds.map(async (id) => {
          const email = id.split("-")[1]; // Assuming the email is part of the ID
          const patient = patientArr.find((patient) => patient.email === email);
  
          if (patient && patient._id) {
            // Now use the _id to delete the patient
            await deletePatient(patient._id);
          } else {
            console.error(`Patient with email ${email} not found or missing _id`);
          }
        })
      );
  
      toast.success("Patient(s) deleted successfully");
  
      // Refresh the patient list by filtering out the deleted patients
      setPatientArr((prevPatients) =>
        prevPatients.filter(
          (patient) =>
            !selectedIds.includes(`${prevPatients.indexOf(patient)}-${patient.email}`)
        )
      );
    } catch (error) {
      toast.error("Error deleting patient(s)");
      console.error("Error deleting patient(s)", error);
    }
  };
  
  
  return (
    <>
      <PageTitle>Patients</PageTitle>
      {patientArr.length > 0 && (
        <Table
          title="Patients List"
          headCells={HEAD_CELLS}
          rows={patientArr}
          handleDelete={handleDelete} // Pass the delete handler to Table
        />
      )}
    </>
  );
};

export default PatientList;
