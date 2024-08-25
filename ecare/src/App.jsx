import React from "react";

import Router from "./router";
import styles from "./App.module.css";

const App = () => {
  return (
    <div className={styles.root}>
      <Router />
    </div>
  );
};

export default App;
