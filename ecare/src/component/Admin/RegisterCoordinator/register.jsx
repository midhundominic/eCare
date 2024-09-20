import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import TextInput from "../../Common/TextInput";
import Button from "../../Common/Button";
import { toast } from "react-toastify";
import { ROUTES } from "../../../router/routes";
import { regCoordinator } from "../../../services/coordinatorServices";

const CoordinatorRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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
      gender,
      password,
    } = formData;

    try {
      const response = await regCoordinator({
        firstName,
        lastName,
        email,
        phone,
        gender,
        password,
      });

      setError({});
      toast.success("Account created successfully.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        c_password: "",
      });
      navigate(ROUTES.COORDINATOR_REGISTER);
    } catch (error) {
      console.error("Error response:", error.response);
      toast.error(error.response?.data.message || "Error Occurred");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerBox}>
        <span className={styles.signupSubtitle}>Register a New Care Coordinator</span>
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

export default CoordinatorRegistration;
