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

        // Check if the token is in the response
        if (response.token) {
          const { role,firstName,lastName,name,email,doctorId,userId } = response.data;
          let fullName = name;

          if (role === 2 || role === 3) {
            fullName = `${firstName} ${lastName}`;
          }

          localStorage.setItem("token", response.token); // Store token
          localStorage.setItem("userData", JSON.stringify({
          email,
          name: fullName,
          role,
          doctorId,
          userId,
        })); // Store user data

          toast.success("Login Successful.");

          // Navigate based on user role
          switch (role) {
            case 1:
              navigate(ROUTES.PATIENT_HOME);
              break;
            case 2:
              navigate(ROUTES.DOCTOR_HOME);
              break;
            case 3:
              navigate(ROUTES.COORDINATOR_HOME);
              break;
            default:
              navigate(ROUTES.PATIENT_HOME); // Default route
          }
        } else {
          toast.error("Token is missing in the response");
        }
        setIsLoading(false);
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
    setIsLoading(true); // Set loading state
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const profilePicture = user.photoURL;
        
        // Get the Firebase ID token
        user.getIdToken().then((tokenId) => {
          const fields = {
            name: user.displayName,
            email: user.email,
            tokenId,  // Send the Firebase ID token to the backend
          };
  
          // Call the backend service to verify the token and login
          authWithGoogleService(fields)
            .then((res) => {
              setIsLoading(false); // Reset loading state
              if (!res.error) {
                const userData={
                  ...res.data,  // Backend response
                  name: res.data.name || user.displayName,
                  email: res.data.email || user.email,
                  role: res.data.data.role || user.role, // Use Firebase displayName as fallback
                  profilePicture: res.data.profilePicture || profilePicture,
                  userId: res.data.data.userId 
                };
                console.log("11111111111",res);
               
                  localStorage.setItem("token", res.token);  // Store the JWT token received from your backend
                  localStorage.setItem("userData", JSON.stringify({
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    profilePicture: userData.profilePicture,
                    userId : userData.userId
                  })); 
                  toast.success("Sign in successful");
                  navigate(ROUTES.PATIENT_HOME);
                
              } else {
                toast.error(res.msg);
              }
            })
            .catch((error) => {
              setIsLoading(false); // Reset loading state
              toast.error(error.response?.data.message || error.message);
            });
        }).catch((error) => {
          setIsLoading(false); // Reset loading state
          toast.error("Error getting Firebase ID token: " + error.message);
        });
      })
      .catch((error) => {
        setIsLoading(false); // Reset loading state
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
