import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Table from "../../Common/Table";
import { HEAD_CELLS } from "./constant";
import { getDoctors, deleteDoctor } from "../../../services/doctorServices";
import Button from "../../Common/Button";
import { ROUTES } from "../../../router/routes";

import styles from "./doctorsList.module.css";
import PageTitle from "../../Common/PageTitle";
import NothingToShow from "../../Common/NothingToShow";

const DoctorsList = () => {
  const [doctorsArr, setDoctorsArr] = useState([]);
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const navigate = useNavigate();

  const formateData = (data) =>
    data.map((doctor, index) => {
      const {
        _id,
        firstName,
        lastName,
        email,
        specialization,
        phone,
        experience,
      } = doctor;

      return {
        id: _id,
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

  const handleDelete = async (idsToDelete) => {
    try {
      for (const id of idsToDelete) {
        await deleteDoctor(id);
      }

      setDoctorsArr((prevDoctorsArr) =>
        prevDoctorsArr.filter((doctor) => !idsToDelete.includes(doctor.id))
      );

      setSelectedDoctors([]); // Reset selected doctors
      toast.success("Doctor deleted successfully!");
    } catch (error) {
      console.error("Error deleting doctors", error);
    }
  };

  const handleRegisterNewDoc = () => {
    navigate(ROUTES.DOCTOR_REGISTER);
  };

  return (
    <>
      {doctorsArr.length ? (
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

          <Table
            title="Doctors List"
            headCells={HEAD_CELLS}
            rows={doctorsArr}
            handleDelete={handleDelete}
          />
        </>
      ) : (
        <NothingToShow
          buttonText="Let's get started!"
          caption="You're about to set up the first doctor profile."
          onClick={handleRegisterNewDoc}
        />
      )}
    </>
  );
};

export default DoctorsList;
