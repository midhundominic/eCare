import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu"; // Hamburger icon
import CloseIcon from "@mui/icons-material/Close"; // Optional: Close icon for the panel
import styles from "./header.module.css";
import SideNav from "../SideNav";

const Header = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.hamburger} onClick={togglePanel}>
          <MenuIcon style={{ color: "white", fontSize: "30px" }} />
        </div>
        <div className={styles.logo}>MyLogo</div>
      </header>

      <div className={`${styles.sidePanel} ${isPanelOpen ? styles.open : ""}`}>
        <div className={styles.panelHeader}>
          <CloseIcon
            style={{ color: "white", fontSize: "30px" }}
            onClick={togglePanel}
          />
        </div>
        <nav className={styles.panelNav}>
          <SideNav />
        </nav>
      </div>
      {isPanelOpen && (
        <div className={styles.overlay} onClick={togglePanel}></div>
      )}
    </>
  );
};

export default Header;
