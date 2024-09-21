import React from "react";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import styles from "./patientHome.module.css";
import PageTitle from "../../Common/PageTitle";

const Home = () => {
  return (
    <div>
      <div className={styles.titleContainer}>
        <PageTitle>Dashboard</PageTitle>
        <div className={styles.notificationWrapper}>
          <NotificationsNoneRoundedIcon
            style={{ color: "white", fontSize: "20px" }}
            // onClick={toggleNotification}
          />
          <div className={styles.notificationStatus} />
        </div>
      </div>
      <h1>Patient Portal </h1>
    </div>
  );
};

export default Home;
