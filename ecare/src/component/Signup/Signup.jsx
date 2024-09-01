import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./signup.module.css";
import FrontImage from "../../assets/images/img_front.png";
import TextInput from "../Common/TextInput";
import Button from "../Common/Button";
import { LOGIN } from "../../router/routes";
import { postSignup } from "../../services/patientServices";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value) {
          error = "Please enter your name";
        } else if (value.length < 3) {
          error = "Name must be at least 3 characters long";
        }
        break;
      case "email":
        if (!value) {
          error = "Please enter your email";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Enter a valid email";
        }
        break;
      case "password":
        if (!value) {
          error = "Please enter a password";
        } else if (!/[!@#$%^&*(),.?":{}|<>]/g.test(value)) {
          error = "Password must contain at least one special character";
        
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the state
    setformData((prevState) => ({ ...prevState, [name]: value }));

    // Validate the field as the user types
    const error = validateField(name, value);
    setFormError((prevState) => ({ ...prevState, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const { name, email, password } = formData;
        console.log("Submitting data:", { name, email, password });
        const response = await postSignup({ name, email, password });
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
            placeholder="Enter your password"
            isRequired={true}
            error={formError["password"]}
          />

          <TextInput
            type="password"
            title="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            isRequired={true}
            error={formError["confirmPassword"]}
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
