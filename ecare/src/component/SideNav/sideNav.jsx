import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { getProfileDoctor, getProfilePatient } from "../../services/profileServices"; // Ensure these functions are correctly implemented

import {
  NAV_CONTENT_ADMIN,
  NAV_CONTENT_COORDINATOR,
  NAV_CONTENT_DOCTOR,
  NAV_CONTENT_PATIENT,
} from "./navContent";
import styles from "./sideNav.module.css";
import { ROUTES } from "../../router/routes";

const SideNav = () => {
  const [activeNav, setActiveNav] = useState(1);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user data and profile image based on role
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userData")); // Get from local storage
        setUserData(user);

        // Fetch specific profile data based on role
        if (user?.role === 2) { // Assuming role 2 is for doctors
          const doctorProfile = await getProfileDoctor();
          setProfileImage(doctorProfile.profilePhoto); // Set profile image path
        } else if (user?.role === 1) { // Assuming role 1 is for patients
          const patientProfile = await getProfilePatient();
          setProfileImage(patientProfile.profilePhoto); // Set profile image path
        } 
        // You can also fetch for coordinators or admin if needed
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };
    fetchProfile();
  }, []);

  // Role-based navigation items
  const roleBasedSlideNav = useMemo(() => {
    switch (userData?.role) {
      case 0:
        return NAV_CONTENT_ADMIN;
      case 1:
        return NAV_CONTENT_PATIENT;
      case 2:
        return NAV_CONTENT_DOCTOR;
      case 3:
        return NAV_CONTENT_COORDINATOR;
      default:
        return NAV_CONTENT_PATIENT;
    }
  }, [userData?.role]);

  // Set active navigation item based on URL
  useEffect(() => {
    if (roleBasedSlideNav.length > 0) {
      const activeNavItem = roleBasedSlideNav.find(
        (item) => item.link === location.pathname
      );
      setActiveNav(activeNavItem?.id || null);
    }
  }, [location.pathname, roleBasedSlideNav]);

  // Navigate to the respective profile page based on user role
  const handleProfileClick = () => {
    switch (userData?.role) {
      case 0:
        navigate(ROUTES.ADMIN_PROFILE);
        break;
      case 1:
        navigate(ROUTES.PATIENT_PROFILE);
        break;
      case 2:
        navigate(ROUTES.DOCTOR_PROFILE);
        break;
      case 3:
        navigate(ROUTES.COORDINATOR_PROFILE);
        break;
      default:
        navigate(ROUTES.PATIENT_PROFILE);
    }
  };

  const handleClick = (item) => {
    setActiveNav(item.id);
    navigate(item.link);
  };

  return (
    <div className={styles.sideNavRoot}>
      <div className={styles.logo}>eCare</div>
      <div className={styles.navWrapper}>
        {roleBasedSlideNav.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItemContainer} ${
              activeNav === item.id && styles.activeNav
            }`}
            onClick={() => handleClick(item)}
          >
            <item.icon style={{ fontSize: "18px" }} />
            <span>{item.title}</span>
          </div>
        ))}
      </div>
      {userData && (
        <div className={styles.navProfile}>
          <div className={styles.imageWrapper}>
            {/* Conditional rendering for profile image */}
            {profileImage ? (
              <img
                src={`http://localhost:5000/src/assets/doctorProfile/${profileImage}`} // Adjust the image path according to your setup
                alt="Profile"
                className={styles.profileImage}
                style={{ width: "36px", height: "36px", borderRadius: "50%" }} // Styling for profile image
              />
            ) : (
              <AccountCircleIcon style={{ color: "white", fontSize: "36px" }} />
            )}
            <EastRoundedIcon
              style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
              onClick={handleProfileClick}
            />
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.navUserInfo}>
              <span>{userData.name || "User"}</span> {/* Accessing name directly */}
              <span className={styles.navEmail}>{userData.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNav;
