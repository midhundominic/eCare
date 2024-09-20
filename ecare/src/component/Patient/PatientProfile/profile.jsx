import React from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import styles from "./patientProfile.module.css";
import EditButton from "../../Common/EditButton/editButton";
import PersonalInfo from "./personalInfo";
import AddressInfo from "./addressInfo";

const Profile = () => {
  return (
    <div className={styles.profileRoot}>
      <h2 className={styles.title}>Profile </h2>
      <div className={styles.titleContainer}>
        <div className={styles.titleWrapper}>
          <AccountCircleIcon style={{ color: "gray", fontSize: "84px" }} />
          <div className={styles.nameContainer}>
            <span className={styles.profileName}>AmalDev k</span>
            <span>amal@gmail.com</span>
            <span>+91 346564566</span>
          </div>
        </div>
        <EditButton />
      </div>
      <PersonalInfo />
      <AddressInfo />
    </div>
  );
};

export default Profile;
