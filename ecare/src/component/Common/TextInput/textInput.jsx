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
      <div className={styles.labelWrapper}>
        <label htmlFor={name}>{title}</label>
        {isRequired && <span className={styles.required}>*</span>}
      </div>
      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={onFocus}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

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

export default TextInput;
