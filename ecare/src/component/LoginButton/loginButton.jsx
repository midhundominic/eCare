import React, { useState } from "react";
import "./loginButton.css";
import googleIcon from "../../assets/icons/ic_google.png";
import rightArrow from "../../assets/icons/ic_arrow_right.png";

const LoginButton = (props) => {
  const { primaryText, secondaryText } = props;
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  return (
    <div className="buttons-container">
      <button className={`login-btn ${isGoogleHovered ? "round" : ""}`}>
        <span className="login-text">{primaryText}</span>
        <img src={rightArrow} alt="Continue" className="arrow-icon" />
      </button>
      <button
        className="google-login-btn"
        onMouseEnter={() => setIsGoogleHovered(true)}
        onMouseLeave={() => setIsGoogleHovered(false)}
      >
        <img src={googleIcon} alt="Google logo" className="google-icon" />
        <span className="login-text">{secondaryText}</span>
      </button>
    </div>
  );
};

export default LoginButton;
