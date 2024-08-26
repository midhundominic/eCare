import React from "react";
import { useNavigate, Link } from "react-router-dom";

import styles from "./login.module.css";
import FrontImage from "../../assets/images/img_front.png";
import TextInput from "../Common/TextInput";
import Checkbox from "../Common/Checkbox";
import Button from "../Common/Button";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <span className={styles.loginTitle}>Welcome Back!</span>
        <span className={styles.loginSubtitle}>
          Enter your Credentials to access your account
        </span>
        <form>
          <TextInput
            type="email"
            title="Email"
            name="email"
            placeholder="Enter your email"
            isRequired={true}
          />
          <TextInput
            type="password"
            title="Password"
            name="password"
            placeholder="Enter your password"
            isRequired={true}
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
