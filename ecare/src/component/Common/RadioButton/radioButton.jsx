import React from "react";
import PropTypes from "prop-types";

import styles from "./radioButton.module.css";

const RadioButton = (props) => {
  const {
    isRequired = false,
    name,
    title,
    labels = [],
    error,
    onChange = () => {},
  } = props;

  return (
    <div className={styles.radioButtonRoot}>
      <div className={styles.labelWrapper}>
        <label htmlFor={name}>{title}</label>
        {isRequired && <span className={styles.required}>*</span>}
      </div>

      <div class={styles.radioSelection}>
        {labels.map((item) => {
          return (
            <label key={item.value}>
              <input
                type="radio"
                name="gender"
                value={item.value}
                onChange={onChange}
              />
              {item.label}
            </label>
          );
        })}
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default RadioButton;

RadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
};
