import React from "react";
import styles from "./addressInfo.module.css";
import EditBox from "../../Common/EditButton/editButton";
import TextInfo from "../../Common/TextInfo";

const AddressInfo = ({ profileData }) => {
  return (
    <div className={styles.infoRoot}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>Address Information</h3>
        <EditBox />
      </div>
      <div className={styles.personalInfoRoot}>
        <TextInfo title="Country" info={profileData.country || "N/A"} />
        <TextInfo title="State/Region" info={profileData.state || "N/A"} />
        <TextInfo title="City" info={profileData.city || "N/A"} />
        <TextInfo title="Postal Code" info={profileData.postalCode || "N/A"} />
      </div>
    </div>
  );
};

export default AddressInfo;
