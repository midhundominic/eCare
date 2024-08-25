import React from "react";
import PropTypes from "prop-types";

import styles from "./textInput.module.css";

const TextInput = (props) => {
  const {
    type,
    name,
    title = "",
    placeholder = "",
    isRequired = false,
    onChange = () => {},
    onFocus = () => {},
    error = "",
  } = props;

  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name}>{title}</label>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        // required={isRequired}
        onChange={onChange}
        onFocus={onFocus}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default TextInput;

TextInput.propTypes = {
  type: PropTypes.oneOf(["email", "password", "text"]).isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};
