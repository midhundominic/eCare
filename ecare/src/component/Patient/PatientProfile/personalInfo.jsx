import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./personalInfo.module.css";
import EditBox from "../../Common/EditButton/editButton";
import TextInfo from "../../Common/TextInfo";
import TextInput from "../../Common/TextInput";
import UpdateButtons from "./UpdateButtons/updateButtons";
import RadioButton from "../../Common/RadioButton";
import DatePicker from "../../Common/DatePicker";
import dayjs from "dayjs";

const PersonalInfo = ({ profileData, isEditing, handleSave, setIsEditing }) => {
  // Set default values for the formData in case profileData is incomplete or undefined
  const [formData, setFormData] = useState({
    dateOfBirth: profileData.dateOfBirth || "",
    gender: profileData.gender || "",
    weight: profileData.weight || "",
    height: profileData.height || "",
    ...profileData, // spread the rest of profileData properties
  });

  useEffect(() => {
    setFormData({
      dateOfBirth: profileData.dateOfBirth || "",
      gender: profileData.gender || "",
      weight: profileData.weight || "",
      height: profileData.height || "",
      ...profileData,
    });
  }, [profileData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSaveClick = () => {
    handleSave(formData); // Save updated profile data
  };

  return (
    <div className={styles.infoRoot}>
      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>Personal Information</h3>
        {!isEditing && <EditBox onClick={() => setIsEditing(true)} />}
      </div>
      {isEditing ? (
        <>
          <div className={styles.personalInfoRoot}>
            <DatePicker
              name="dateOfBirth"
              title="Date of birth"
              value={
                formData.dateOfBirth
                  ? dayjs(formData.dateOfBirth) // Convert string to Dayjs object for DatePicker
                  : null
              }
              onChange={(date) => {
                setFormData((prevState) => ({
                  ...prevState,
                  dateOfBirth: dayjs(date).format("YYYY-MM-DD"), // Store the date as 'YYYY-MM-DD'
                }));
              }}
              isRequired
            />

            <RadioButton
              isRequired
              name="gender"
              title="Gender"
              value={formData.gender}
              labels={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "others", label: "Others" },
              ]}
              onChange={handleChange}
            />
            <TextInput
              type="text"
              title="Weight"
              name="weight"
              value={formData.weight?.toString() || ""}
              onChange={handleChange}
              placeholder="Enter your weight"
              isRequired={true}
            />
            <TextInput
              type="text"
              title="Height"
              name="height"
              value={formData.height?.toString() || ""}
              onChange={handleChange}
              placeholder="Enter your height"
              isRequired={true}
            />
          </div>
          <UpdateButtons
            handleClickCancel={() => setIsEditing(false)}
            handleClickSave={handleSaveClick}
          />
        </>
      ) : (
        <div className={styles.personalInfoRoot}>
          <TextInfo
            title="Date of Birth"
            info={
              formData.dateOfBirth
                ? dayjs(formData.dateOfBirth).format("DD-MM-YYYY")
                : "N/A"
            }
          />
          <TextInfo title="Gender" info={formData.gender || "N/A"} />
          <TextInfo title="Weight" info={`${formData.weight || "N/A"} kg`} />
          <TextInfo title="Height" info={`${formData.height || "N/A"} cm`} />
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;

PersonalInfo.propTypes = {
  profileData: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  handleSave: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};
