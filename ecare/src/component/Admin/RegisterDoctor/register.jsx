import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import styles from "./register.module.css";
import TextInput from "../../Common/TextInput";
import Button from "../../Common/Button";
import { regDoctor } from "../../../services/doctorServices";
import { ROUTES } from "../../../router/routes";
import PageTitle from "../../Common/PageTitle";
import RadioButton from "../../Common/RadioButton";
import SelectBox from "../../Common/SelectBox";

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    y_experience: "",
    gender: "",
    password: "",
    c_password: "",
  });

  const [error, setError] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setError((prevState) => ({ ...prevState, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      phone,
      specialization,
      experience,
      gender,
      y_experience,
      password,
    } = formData;

    try {
      const response = await regDoctor({
        firstName,
        lastName,
        email,
        phone,
        specialization,
        experience,
        gender,
        y_experience,
        password,
      });

      setError({});
      toast.success("Account created successfully.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        experience: "",
        gender: "",
        y_experience: "",
        password: "",
        c_password: "",
      });
      navigate(ROUTES.DOCTOR_REGISTER);
    } catch (error) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data.message || "Error Occurred");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <PageTitle>Register a New Doctor</PageTitle>
        <form onSubmit={handleSubmit}>
          <div className={styles.formContent}>
            <TextInput
              type="text"
              title="First Name"
              name="firstName"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={handleChange}
              isRequired={true}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
            <TextInput
              type="text"
              title="Last Name"
              name="lastName"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={handleChange}
              isRequired={true}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />

            <SelectBox
              name="experience"
              title="Experience Level"
              value={formData.experience}
              isRequired
              onChange={handleChange}
              options={[
                { value: "senior", label: "Senior" },
                { value: "junior", label: "junior" },
                { value: "mid-level", label: "Mid-Level" },
              ]}
              styles={{ selectBoxRoot: styles.selectBoxRoot }}
            />

            
            <RadioButton
              isRequired
              name="gender"
              title="Gender"
              labels={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "others", label: "Others" },
              ]}
              onChange={handleChange}
            />
            <TextInput
              type="text"
              title="Email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              isRequired={true}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
            <TextInput
              type="text"
              title="Phone No"
              name="phone"
              placeholder="Enter Phone number"
              value={formData.phone}
              onChange={handleChange}
              isRequired={true}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
            <TextInput
              type="text"
              title="specialization"
              name="specialization"
              placeholder="Enter specialization"
              value={formData.specialization}
              onChange={handleChange}
              isRequired={true}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
            <SelectBox
              name="y_experience"
              title="Year of Experience"
              value={formData.y_experience}
              isRequired
              onChange={handleChange}
              options={[
                { value: "0-2", label: "0-2 Years" },
                { value: "3-5", label: "3-5 Years" },
                { value: ">6", label: "More than 6 Years" },
              ]}
              styles={{ selectBoxRoot: styles.selectBoxRoot }}
            />

            <TextInput
              type="text"
              title="Password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              isRequired={true}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
            <TextInput
              type="text"
              title="Confirm Password"
              name="c_password"
              placeholder="Confirm password"
              value={formData.c_password}
              onChange={handleChange}
              isRequired={true}
              styles={{ inputGroup: styles.customizeInputGroup }}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button type="submit" styles={{ btnPrimary: styles.newButton }}>
              Create Doctor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;
