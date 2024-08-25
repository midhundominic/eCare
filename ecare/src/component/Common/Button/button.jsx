import React, { useMemo } from "react";
import PropTypes from "prop-types";

import styles from "./button.module.css";

const Button = (props) => {
  const { varient = "primary", name, children, onClick } = props;

  const buttonStyle = useMemo(() => {
    switch (varient) {
      case "primary":
        return styles.btnPrimary;
      case "secondary":
        return styles.btnSecondary;
    }
  });
  return (
    <button type="submit" name={name} className={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  name: PropTypes.string,
  varient: PropTypes.oneOf(["primary", "secondary"]),
  onclick: PropTypes.func,
};
