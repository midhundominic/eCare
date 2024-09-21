import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../../Common/Table";
import { HEAD_CELLS } from "./constant";
import { getPatients } from "../../../services/patientServices";
import Button from "../../Common/Button";
import { ROUTES } from "../../../router/routes";

import styles from "./patientList.module.css";
import PageTitle from "../../Common/PageTitle";

const PatientList = () => {
  const [patientArr, setPatientArr] = useState([]);
  const navigate = useNavigate();

  const formatData = (data) => {
    return data.map((patient, index) => {
      const { name, email } = patient;
      return {
        id: `${index}-${email}`,
        name,
        email,
      };
    });
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await getPatients();
        const formattedData = formatData(response.data);
        // console.log("from API:", response);
        setPatientArr(formattedData);
      } catch (error) {
        console.error("Error fetching Patients", error);
      }
    };

    fetchPatient();
  }, []);

  const handleRegisterNewPatient = () => {
    navigate(ROUTES.COORDINATOR_REGISTER);
  };

  return (
    <>
      <PageTitle>Patients</PageTitle>
      <div className={styles.buttonContainer}>
        <Button
          variant="primary"
          onClick={handleRegisterNewPatient}
          styles={{ btnPrimary: styles.newButton }}
        >
          New Care Coordinator
        </Button>
      </div>
      {patientArr.length > 0 && (
        <Table title="Patients List" headCells={HEAD_CELLS} rows={patientArr} />
      )}
    </>
  );
};

export default PatientList;
