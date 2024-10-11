import React, { useState, useEffect } from "react";
import {
    getProfileDoctor,
    uploadDoctorProfilePic,
} from "../../../services/profileServices";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditButton from "../../Common/EditButton/editButton";
import UpdateButtons from "./updateButtons/updateButtons";
import LogoutButton from "../../LogoutButton";
import styles from "./doctorProfile.module.css";

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [profileImage, setProfileImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfileDoctor();
                setProfileData(res);
                setProfileImage(res.profilePhoto || "");
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching profile data", error);
            }
        };
        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPreviewImage(reader.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (previewImage) {
            const file = document.querySelector('input[type="file"]').files[0];
            const formData = new FormData();
            formData.append("profilePhoto", file);
            formData.append("email", profileData.email);

            try {
                const res = await uploadDoctorProfilePic(formData);
                setProfileImage(res.profilePhoto);
                setPreviewImage("");
                setIsEditing(false);

                // Store the updated profile photo in localStorage
                localStorage.setItem("updatedProfilePhoto", res.profilePhoto);

                // Optionally, you can refresh the page to reload the SlideNav, but this is not ideal
                // window.location.reload(); 
            } catch (error) {
                console.error(
                    "Error uploading profile image",
                    error.response?.data || error.message
                );
            }
        }
    };

    const handleCancel = () => {
        setPreviewImage("");
        setIsEditing(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.profileRoot}>
            <h2 className={styles.title}>Profile</h2>
            <div className={styles.titleContainer}>
                <div className={styles.titleWrapper}>
                    <div className={styles.profileImageContainer}>
                        {profileImage || previewImage ? (
                            <img
                                src={previewImage || `http://localhost:5000/src/assets/doctorProfile/${profileImage}`}
                                alt="Profile"
                                className={styles.profileImage}
                            />
                        ) : (
                            <AccountCircleIcon
                                style={{ color: "gray", fontSize: "84px" }}
                                className={styles.accountIcon}
                            />
                        )}
                    </div>
                    <div className={styles.nameContainer}>
                        <span className={styles.profileName}>
                            {profileData.firstName} {profileData.lastName}
                        </span>
                        <span>{profileData.email}</span>
                        <span>{profileData.phone}</span>
                    </div>
                </div>
                {!isEditing && <EditButton onClick={() => setIsEditing(true)} />}
            </div>

            {isEditing && (
                <>
                    <input
                        type="file"
                        name="profilePhoto"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <UpdateButtons
                        handleClickCancel={handleCancel}
                        handleClickSave={handleSave}
                    />
                </>
            )}

            <LogoutButton />
        </div>
    );
};

export default Profile;
