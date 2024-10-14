import React, { useState, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditButton from "../../Common/EditButton/editButton";
import PersonalInfo from "./personalInfo";
import LogoutButton from "../../LogoutButton";
import {
  getProfilePatient,
  updateProfilePatient,
} from "../../../services/profileServices";
import styles from "./patientProfile.module.css";

const Profile = () => {
  const [profileData, setProfileData] = useState(null); // Initialize with null
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfilePatient();
        setProfileData(res.data); // Assign the profile data properly
      } catch (error) {
        console.error("Error fetching profile data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      await updateProfilePatient(updatedData); // Update profile on the backend
      
      // Directly update the local state with the updated form data
      setProfileData((prevData) => ({
        ...prevData,
        ...updatedData, // Merge updated data into profileData
      }));
      
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Ensure profileData is defined and the profile has essential data (name, etc.)
  if (!profileData || !profileData.name) {
    return <div>Please complete your profile information.</div>;
  }
  console.log(profileData)
  return (
    <div className={styles.profileRoot}>
      <h2 className={styles.title}>Profile</h2>
      <div className={styles.titleContainer}>
        <div className={styles.titleWrapper}>
          <AccountCircleIcon style={{ color: "gray", fontSize: "84px" }} />
          <div className={styles.nameContainer}>
            <span className={styles.profileName}>
              {profileData.name || "No Name Provided"}
            </span>
            <span>{profileData.email}</span>
          </div>
        </div>
        <EditButton onClick={() => setIsEditing(true)} />
      </div>

      <LogoutButton />

      <PersonalInfo
        profileData={profileData} // Pass the correct profile data
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
      />
    </div>
  );
};

export default Profile;
