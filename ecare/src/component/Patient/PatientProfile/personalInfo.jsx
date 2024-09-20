import React, { useState } from "react";
import PropTypes from "prop-types";

import styles from "./personalInfo.module.css";
import EditBox from "../../Common/EditButton/editButton";
import TextInfo from "../../Common/TextInfo";
import TextInput from "../../Common/TextInput";
import Button from "../../Common/Button/button";
import UpdateButtons from "./UpdateButtons/updateButtons";
import RadioButton from "../../Common/RadioButton";
import DatePicker from "../../Common/DatePicker";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({ weight: "", height: "" });
  const [formError, setFormError] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setFormError({ ...formError, [name]: "" });
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
            <DatePicker name="dob" title="Date of birth" isRequired />
            <RadioButton
              isRequired
              name="gender"
              title="Gender"
              labels={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "others", label: "Others" },
              ]}
            />
            <TextInput
              type="text"
              title="Weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter your weight"
              isRequired={true}
              error={formError["weight"]}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
            <TextInput
              type="text"
              title="Height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              placeholder="Enter your height"
              isRequired={true}
              error={formError["height"]}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
          </div>
          <UpdateButtons handleClickCancel={() => setIsEditing(false)} />
        </>
      ) : (
        <div className={styles.personalInfoRoot}>
          <TextInfo title="Date of Birth" info="23/08/1992" />
          <TextInfo title="Gender" info="Male" />
          <TextInfo title="Weight" info="76 kg" />
          <TextInfo title="Height" info="168 cm" />
        </div>
      )}
    </div>
  );
};

export default PersonalInfo;

PersonalInfo.propTypes = {
  isEdit: PropTypes.bool,
};
