import React, { useState, useEffect } from 'react';
import { getPendingTests, submitTestResults } from '../../../services/coordinatorServices';
import { toast } from 'react-toastify';

const TestResults = () => {
  const [pendingTests, setPendingTests] = useState([]);

  useEffect(() => {
    fetchPendingTests();
  }, []);

  const fetchPendingTests = async () => {
    try {
      const tests = await getPendingTests();
      setPendingTests(tests);
    } catch (error) {
      toast.error('Error fetching pending tests');
    }
  };

  const handleSubmitResult = async (testId, result) => {
    try {
      await submitTestResults(testId, result);
      toast.success('Test result submitted successfully');
      fetchPendingTests();
    } catch (error) {
      toast.error('Error submitting test result');
    }
  };

  return (
    <div className="test-results">
      <h2>Pending Test Results</h2>
      {pendingTests.map((test) => (
        <div key={test._id} className="test-card">
          <h3>Patient: {test.patientName}</h3>
          <p>Test: {test.testName}</p>
          <p>Prescribed by: Dr. {test.doctorName}</p>
          <p>Date: {new Date(test.prescriptionDate).toLocaleDateString()}</p>
          <input
            type="text"
            placeholder="Enter test result"
            onChange={(e) => handleSubmitResult(test._id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default TestResults;