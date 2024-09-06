import React from "react";
import Header from "../Header";
import styles from "./main.module.css";
import SideNav from "../SideNav";
import Home from "../PatientHome";

const Main = () => {
  return (
    <div>
      <Header />
      <div className={styles.sidePanelDesktop}>
        <nav className={styles.panelNav}>
          <SideNav />
        </nav>
      </div>
      <div className={styles.mainContent}>
        <Home />
      </div>
    </div>
  );
};

export default Main;
