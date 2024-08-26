import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "./signup.module.css";
import FrontImage from "../../assets/images/img_front.png";
import TextInput from "../Common/TextInput";
import Checkbox from "../Common/Checkbox";
import Button from "../Common/Button";
import { LOGIN } from "../../router/routes";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the state
    setformData((prevState) => ({ ...prevState, [name]: value }));
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword } = formData;
    let errors = {};
    if (!name) {
      errors = { ...errors, name: "Please enter your name" };
    }
    if (!email) {
      errors = { ...errors, email: "Please enter your email" };
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email";
    }
    if (!password) {
      errors = { ...errors, password: "Please enter a password" };
    }
    if (password !== confirmPassword) {
      errors = { ...errors, password: "Passwords do not match" };
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const { name, email, password } = formData;
        console.log("Submitting data:", { name, email, password });
        const response = await axios.post(
          "http://localhost:5000/api/Patient_Login",
          {
            name,
            email,
            password,
          }
        );
        setFormError({});
        if (response.status === 201) {
          alert("SignUp Success");
          setformData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          navigate(LOGIN);
        } else {
          alert("SignUp Failed");
        }
      } catch (error) {
        console.error("Error response:", error.response);
        alert(error.response?.data.message || "Error Occurred");
      }
    } else {
      setFormError(validationErrors);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupBox}>
        <span className={styles.signupTitle}>Welcome!</span>
        <span className={styles.signupSubtitle}>Create an Account</span>

        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            title="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={validateForm}
            placeholder="Enter your Name"
            isRequired={true}
            error={formError["name"]}
          />

          <TextInput
            type="text"
            title="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={validateForm}
            placeholder="Enter your email"
            isRequired={true}
            error={formError["email"]}
          />

          <TextInput
            type="password"
            title="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onFocus={validateForm}
            placeholder="Enter your password"
            isRequired={true}
          />

          <TextInput
            type="password"
            title="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onFocus={validateForm}
            placeholder="Confirm Password"
            isRequired={true}
          />
          <div className={styles.buttonWrapper}>
            <Button type="submit">Signup</Button>
          </div>
        </form>

        <div className={styles.seperator}>or</div>
        <Button variant="secondary">
          <div className={styles.googleButton}>
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google logo"
            />
            Sign in with Google
          </div>
        </Button>
        <div className={styles.signinLink}>
          Have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(LOGIN);
            }}
          >
            Sign In
          </a>
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <img className={styles.frontImage} src={FrontImage} alt="Signup" />
      </div>
    </div>
  );
};

export default Signup;
