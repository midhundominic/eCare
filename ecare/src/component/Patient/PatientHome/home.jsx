import React, { useEffect, useState } from "react";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import styles from "./patientHome.module.css";
import PageTitle from "../../Common/PageTitle";
import Carousel from "./carousel"; // New carousel component
import hospitalImages from "./hospitalImages" // Import images for the carousel

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = hospitalImages.length;

  // Function to change the image every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(intervalId);
  }, [totalImages]);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.titleContainer}>
        <PageTitle>Dashboard</PageTitle>
        <div className={styles.notificationWrapper}>
          <NotificationsNoneRoundedIcon
            style={{ color: "white", fontSize: "20px" }}
          />
          <div className={styles.notificationStatus} />
        </div>
      </div>
      <h1 className={styles.dashboardTitle}>Patient Portal</h1>

      {/* Carousel Section */}
      <Carousel images={hospitalImages} currentIndex={currentIndex} />

      {/* Additional content can go here */}
      <div className={styles.content}>
        <h2>Welcome to the Patient Portal</h2>
        <p>
          Here, you can access your medical records, schedule appointments,
          and connect with healthcare professionals.
        </p>
      </div>
    </div>
  );
};

export default Home;
