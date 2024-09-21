import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Table from "../../Common/Table";
import { HEAD_CELLS } from "./constant";
import { getDoctors } from "../../../services/doctorServices";
import Button from "../../Common/Button";
import { ROUTES } from "../../../router/routes";

import styles from "./doctorsList.module.css";
import PageTitle from "../../Common/PageTitle";

const DoctorsList = () => {
  const [doctorsArr, setDoctorsArr] = useState([]);
  const navigate = useNavigate();

  const formateData = (data) =>
    data.map((doctor, index) => {
      const { firstName, lastName, email, specialization, phone, experience } =
        doctor;
      return {
        id: `${index}-${email}`,
        name: `${firstName} ${lastName}`,
        email,
        specialization,
        phone,
        experience,
      };
    });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctors();
        const formattedData = formateData(response.data);

        setDoctorsArr(formattedData);
      } catch (error) {
        console.error("Error fetching doctors", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleRegisterNewDoc = () => {
    navigate(ROUTES.DOCTOR_REGISTER);
  };

  return (
    <>
      <PageTitle>Doctors</PageTitle>
      <div className={styles.buttonContainer}>
        <Button
          variant="primary"
          onClick={handleRegisterNewDoc}
          styles={{ btnPrimary: styles.newButton }}
        >
          New Doctor
        </Button>
      </div>
      {doctorsArr.length > 0 && (
        <Table title="Doctors List" headCells={HEAD_CELLS} rows={doctorsArr} />
      )}
    </>
  );
};

export default DoctorsList;
