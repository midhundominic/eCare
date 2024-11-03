import React from "react";
import PropTypes from "prop-types";

import styles from "./checkbox.module.css";

const Checkbox = (props) => {
  const { name, title, onChange = () => {} } = props;
  return (
    <div className={styles.checkboxRoot}>
      <input type="checkbox" id={name} onChange={onChange} {...props} />
      <label htmlFor={name}>{title}</label>
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  onChange: PropTypes.func,
};
