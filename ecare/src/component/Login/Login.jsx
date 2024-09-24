import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import {
  postSignin,
  authWithGoogleService,
} from "../../services/patientServices";
import styles from "./login.module.css";
import FrontImage from "../../assets/images/img_front.png";
import TextInput from "../Common/TestInputPassword";
import Checkbox from "../Common/Checkbox";
import { ROUTES } from "../../router/routes";
import LoginButton from "../LoginButton";

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setError((prevState) => ({ ...prevState, [name]: "" }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    let errors = {};
    if (!email) {
      errors.email = "Please enter your email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email";
    }
    if (!password) {
      errors.password = "Please enter your password";
    }
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const { email, password } = formData;
        const response = await postSignin({ email, password });

        if (response.data) {
          setIsLoading(false);
          setError({});
          localStorage.setItem("userData", JSON.stringify(response.data));
          toast.success("Login Successful.");

          if (response.data.role === 1) {
            navigate(ROUTES.PATIENT_HOME);
          } else if (response.data.role === 2) {
            navigate(ROUTES.DOCTOR_HOME);
          } else if (response.data.role === 3) {
            navigate(ROUTES.COORDINATOR_HOME);
          }
        }
      } catch (err) {
        setIsLoading(false);
        toast.error(err.response?.data.message || "Error Occurred");
      }
    } else {
      setError(validationErrors);
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const fields = {
          name: user.displayName,
          email: user.email,
          password: null,
          images: user.photoURL,
          phone: user.phoneNumber,
        };

        authWithGoogleService(fields)
          .then((res) => {
            if (res.error !== true) {
              localStorage.setItem("token", res.token);
              localStorage.setItem("userData", JSON.stringify(res.data));
              toast.success("Sign in successful");
              navigate(ROUTES.PATIENT_HOME);
              setIsLoading(false);
            } else {
              toast.error(res.msg);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            toast.error(error.response?.data.message || error.message);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        {isLoading && (
          <div className={styles.loginLoader}>
            <CircularProgress />
          </div>
        )}
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
          <div className={styles.signupLink}>
            <a
              href="#"
              onClick={() => {
                navigate(ROUTES.FORGOT_PASSWORD);
              }}
            >
              Forgot Password?
            </a>
          </div>
          <Checkbox name="remember-me" title="Remember me" />

          <div className={styles.buttonWrapper}>
            <LoginButton
              primaryText="Login"
              secondaryText="Sign in with Google"
              onGoogleSignIn={signInWithGoogle} // Google Sign-In
              isDisabled={isLoading}
            />
          </div>
          <div className={styles.signupLink}>
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={() => {
                navigate(ROUTES.SIGNUP);
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
