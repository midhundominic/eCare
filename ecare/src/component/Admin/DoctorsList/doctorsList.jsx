import React from "react";
import Table from "../../Common/Table";
import { HEAD_CELLS } from "./constant";

const DoctorsList = () => {
  return (
    <>
    <h4>Doctors listing</h4>
      <Table title="Doctors" headCells={HEAD_CELLS} />
    </>
  );
};

export default DoctorsList;
