import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditButton from "../../Common/EditButton/editButton";
import PersonalInfo from "./personalInfo";
import LogoutButton from "../../LogoutButton";
import { getProfilePatient, updateProfilePatient } from "../../../services/profileServices";
import styles from "./patientProfile.module.css";
import AddressInfo from "./addressInfo";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);  // Initialize with null
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch profile data from backend
    const fetchProfile = async () => {
      try {
        const res = await getProfilePatient();
        setProfileData(res);  // Assign profile data
      } catch (error) {
        console.error("Error fetching profile data", error);
      } finally {
        setIsLoading(false);  // Stop loading spinner
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      const res = await updateProfilePatient(updatedData); // Update PUT request
      setProfileData(res);  // Update the local state with new profile data
      setIsEditing(false);  // Exit edit mode
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Ensure that profileData is defined
  if (!profileData || !profileData.personalInfo) {
    return <div>Please complete your profile information.</div>;
  }

  return (
    <div className={styles.profileRoot}>
      <h2 className={styles.title}>Profile</h2>
      <div className={styles.titleContainer}>
        <div className={styles.titleWrapper}>
          <AccountCircleIcon style={{ color: "gray", fontSize: "84px" }} />
          <div className={styles.nameContainer}>
            <span className={styles.profileName}>
              {profileData.patient?.name || "No Name Provided"}
            </span>
            <span>{profileData.patient?.email}</span>
          </div>
        </div>
        <EditButton onClick={() => setIsEditing(true)} />
      </div>

      <LogoutButton />

      <PersonalInfo
        profileData={profileData.personalInfo}  // Pass the correct profile data
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
      />
      {/* <AddressInfo profileData={profileData.personalInfo} /> */}
    </div>
  );
};

export default Profile;
