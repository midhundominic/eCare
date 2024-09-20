import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import EastRoundedIcon from "@mui/icons-material/EastRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { NAV_CONTENT_ADMIN, NAV_CONTENT_PATIENT } from "./navContent";
import styles from "./sideNav.module.css";
import { ROUTES } from "../../router/routes";

const SideNav = () => {
  const [activeNav, setActiveNav] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const activeNavItem = NAV_CONTENT_PATIENT.filter(
      (item) => item.link === location.pathname
    );
    if (activeNavItem.length > 0) {
      setActiveNav(activeNavItem[0]?.id);
    } else {
      setActiveNav(null);
    }
  }, [location.pathname]);

  const handleClick = (item) => {
    setActiveNav(item.id);
    navigate(item.link);
  };

  
  const roleBasedSlideNav = useMemo(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    switch (userData.role) {
      case 0:
        return NAV_CONTENT_ADMIN;
      case 1:
        return NAV_CONTENT_PATIENT;
      default:
        return NAV_CONTENT_PATIENT;
    }
  }, []);

  return (
    <div className={styles.sideNavRoot}>
      <div className={styles.logo}>eCare</div>
      <div className={styles.navWrapper}>
        {roleBasedSlideNav.map((item) => {
          return (
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
          );
        })}
      </div>
      <div className={styles.navProfile}>
        <div className={styles.imageWrapper}>
          <AccountCircleIcon style={{ color: "white", fontSize: "36px" }} />
          <EastRoundedIcon
            style={{ color: "white", fontSize: "24px", cursor: "pointer" }}
            onClick={() => navigate(ROUTES.PATIENT_PROFILE)}
            // onClick={handleClickProfile}
          />
        </div>
        <div className={styles.infoWrapper}>
          <div className={styles.navUserInfo}>
            <span>Amaldev K</span>
            <span className={styles.navEmail}>amal@gmail.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
