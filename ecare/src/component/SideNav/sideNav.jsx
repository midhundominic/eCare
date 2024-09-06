import React from "react";
import styles from "./sideNav.module.css";

const SideNav = () => {
  return (
    <div className={styles.sideNavRoot}>
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </div>
  );
};

export default SideNav;
