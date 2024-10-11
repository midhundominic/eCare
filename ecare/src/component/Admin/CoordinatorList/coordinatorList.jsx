import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Table from "../../Common/Table";
import { HEAD_CELLS } from "./constant";
import { getCoordinator, deleteCoordinator } from "../../../services/coordinatorServices";
import Button from "../../Common/Button";
import { ROUTES } from "../../../router/routes";

import styles from "./coordinatorList.module.css";
import PageTitle from "../../Common/PageTitle";

const CoordinatorList = () => {
  const [coordinatorArr, setCoordinatorArr] = useState([]);
  const [selectedCoordinator, setSelectedCoordinator] = useState([]);
  const navigate = useNavigate();

   const formateData = (data) =>
    data.map((coordinator, index) => {
      const { _id,firstName, lastName, email, phone, gender } = coordinator;
      return {
        id: _id,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        gender,
      };
    });

  useEffect(() => {
    const fetchCoordinator = async () => {
      try {
        const response = await getCoordinator();
        const formattedData = formateData(response.data);
        setCoordinatorArr(formattedData);
      } catch (error) {
        console.error("Error fetching Care Coordinator", error);
      }
    };

    fetchCoordinator();
  }, []);

  const handleDelete = async (idsToDelete) => {
    try {
      for (const id of idsToDelete) {
        await deleteCoordinator(id);
      }
      setCoordinatorArr((prevCoordinatorArr) =>
        prevCoordinatorArr.filter(coordinator => !idsToDelete.includes(coordinator.id))
      );
  
      setSelectedCoordinator([]); // Reset selected doctors
      toast.success("Coordinator deleted successfully!");
    } catch (error) {
      console.error("Error deleting doctors", error);
    }
  };

  const handleRegisterNewCoor = () => {
    navigate(ROUTES.COORDINATOR_REGISTER);
  };

  return (
    <>
      <PageTitle>Care Coordinator</PageTitle>
      <div className={styles.buttonContainer}>
        <Button
          variant="primary"
          onClick={handleRegisterNewCoor}
          styles={{ btnPrimary: styles.newButton }}
        >
          New Care Coordinator
        </Button>
      </div>
      {coordinatorArr.length > 0 && (
        <Table
          title="Care Coordinator List"
          headCells={HEAD_CELLS}
          rows={coordinatorArr}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default CoordinatorList;
