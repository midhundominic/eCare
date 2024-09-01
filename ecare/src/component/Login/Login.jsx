import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./login.module.css";
import FrontImage from "../../assets/images/img_front.png";
import TextInput from "../Common/TextInput";
import Checkbox from "../Common/Checkbox";
import Button from "../Common/Button";
import { HOME } from "../../router/routes";
import { postSignin } from "../../services/patientServices";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setError((prevState) => ({ ...prevState, [name]: "" }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    let errors = {};
    if (!email) {
      errors.email = "Pleace enter your email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email";
    }
    if (!password) {
      errors.password = "Pleace enter your password";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    console.log("11", validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const { email, password } = formData;
        const response = await postSignin({
          email,
          password,
        });
        setError({});
        console.log("res", response);

        alert("SignIn Success");
        setFormData({
          email: "",
          password: "",
        });
        navigate(HOME);
      } catch (err) {
        console.error("Error response:", error.response);
        alert(error.response?.data.message || "Error Occured");
      }
    } else {
      setError(validationErrors);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <span className={styles.loginTitle}>Welcome Back!</span>
        <span className={styles.loginSubtitle}>
          Enter your Credentials to access your account
        </span>
        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            title="Email"
            name="email"
            onChange={handleChange}
            onFocus={validateForm}
            value={formData.email}
            placeholder="Enter your email"
            error={error["email"]}
          />
          <TextInput
            type="password"
            title="Password"
            name="password"
            onChange={handleChange}
            onFocus={validateForm}
            value={formData.password}
            placeholder="Enter your password"
            error={error["password"]}
          />
          <Checkbox name="remember-me" title="Remember me" />
          <div className={styles.buttonWrapper}>
            <Button>Login</Button>
          </div>

          <div className={styles.separator}>or</div>
          <Button variant="secondary">
            <div className={styles.googleButton}>
              <img
                src="https://img.icons8.com/color/16/000000/google-logo.png"
                alt="Google logo"
              />
              Sign in with Google
            </div>
          </Button>
          <div className={styles.signupLink}>
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={() => {
                navigate("/Signup");
              }}
            >
              Sign Up
            </a>
          </div>
        </form>
      </div>
      <div className={styles.imageWrapper}>
        <img className={styles.frontImage} src={FrontImage} alt="Login" />
      </div>
    </div>
  );
};

export default Login;
