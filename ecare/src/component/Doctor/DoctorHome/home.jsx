import React from 'react';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import styles from "./doctorHome.module.css"

const home = () => {
  return (
    <div>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Dashboard</h2>
        <div className={styles.notificationWrapper}>
          <NotificationsNoneRoundedIcon
            style={{ color: "white", fontSize: "20px" }}
            // onClick={toggleNotification}
          />
          <div className={styles.notificationStatus} />
        </div>
      </div>
      <h1>Doctor Portal </h1>
    </div>
  )
}

export default home
