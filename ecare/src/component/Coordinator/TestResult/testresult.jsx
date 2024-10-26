import React, { useState, useEffect } from 'react';
import { getPendingTests, submitTestResults } from '../../../services/coordinatorServices';
import { toast } from 'react-toastify';
import styles from './testresult.module.css';

const PendingTests = () => {
  const [pendingTests, setPendingTests] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    fetchPendingTests();
  }, []);

  const fetchPendingTests = async () => {
    try {
      const tests = await getPendingTests();
      setPendingTests(tests);
      const initialResults = {};
      tests.forEach(appointment => {
        appointment.prescription.tests.forEach(test => {
          if (!test.result) {
            initialResults[`${appointment._id}-${test._id}`] = '';
          }
        });
      });
      setResults(initialResults);
    } catch (error) {
      console.error("Error fetching pending tests:", error);
      toast.error("Failed to fetch pending tests");
    }
  };

  const handleResultChange = (appointmentId, testId, value) => {
    setResults(prev => ({
      ...prev,
      [`${appointmentId}-${testId}`]: value
    }));
  };

  const handleSubmitResult = async (appointmentId, testId) => {
    try {
      const result = results[`${appointmentId}-${testId}`];
      await submitTestResults(appointmentId, testId, result);
      toast.success("Test result submitted successfully");
      fetchPendingTests(); // Refresh the list after submitting
    } catch (error) {
      console.error("Error submitting test result:", error);
      toast.error("Failed to submit test result");
    }
  };

  return (
    <div className={styles.pendingTestsContainer}>
      <h2 className={styles.title}>Pending Tests</h2>
      {pendingTests.map((appointment) => (
        <div key={appointment._id} className={styles.appointmentCard}>
          <h3 className={styles.patientName}>Patient: {appointment.patientId.name}</h3>
          <p className={styles.doctorName}>Doctor: Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}</p>
          <p className={styles.appointmentDate}>Date: {new Date(appointment.appointmentDate).toLocaleDateString()}</p>
          {appointment.prescription.tests.map((test) => (
            <div key={test._id} className={styles.testItem}>
              <p className={styles.testName}>Test: {test.name}</p>
              {test.result ? (
                <p className={styles.testResult}>Result: {test.result}</p>
              ) : (
                <div className={styles.resultInputContainer}>
                  <input
                    type="text"
                    className={styles.resultInput}
                    placeholder="Enter test result"
                    value={results[`${appointment._id}-${test._id}`] || ''}
                    onChange={(e) => handleResultChange(appointment._id, test._id, e.target.value)}
                  />
                  <button
                    className={styles.submitButton}
                    onClick={() => handleSubmitResult(appointment._id, test._id)}
                    disabled={!results[`${appointment._id}-${test._id}`]}
                  >
                    Submit Result
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PendingTests;