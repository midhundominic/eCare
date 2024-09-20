import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import TextInput from "../../Common/TextInput";
import Button from "../../Common/Button";
import { regDoctor } from "../../../services/doctorServices";
import { toast } from "react-toastify";
import { ROUTES } from "../../../router/routes";

const DoctorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    y_experience:"",
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
        y_experience:"",
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
        <span className={styles.signupSubtitle}>Register a New Doctor</span>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            title="First Name"
            name="firstName"
            placeholder="Enter First Name"
            value={formData.firstName}
            onChange={handleChange}
            isRequired={true}
          />
          <TextInput
            type="text"
            title="Last Name"
            name="lastName"
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={handleChange}
            isRequired={true}
          />

          <label className={styles.inputLabel} htmlFor="text">
            Experience
          </label>
          <select
            name="experience"
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="">Select Experience</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
          </select>

          <label className={styles.inputLabel} htmlFor="gender">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <TextInput
            type="text"
            title="Email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            isRequired={true}
          />
          <TextInput
            type="text"
            title="Phone No"
            name="phone"
            placeholder="Enter Phone number"
            value={formData.phone}
            onChange={handleChange}
            isRequired={true}
          />
          <TextInput
            type="text"
            title="specialization"
            name="specialization"
            placeholder="Enter specialization"
            value={formData.specialization}
            onChange={handleChange}
            isRequired={true}
          />
          <label className={styles.inputLabel} htmlFor="y_experience">
            Year of Experience
          </label>
          <select
            name="y_experience"
            value={formData.y_experience}
            onChange={handleChange}
            className={styles.inputField}
            required
          >
            <option value="">Select</option>
            <option value="0-2 Years">0-2 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="More than 6 Years">More than 6 Years</option>
          </select>

          <TextInput
            type="text"
            title="Password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            isRequired={true}
          />
          <TextInput
            type="text"
            title="Confirm Password"
            name="c_password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            isRequired={true}
          />

          <Button type="submit" className={styles.saveButton}>
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegistration;
