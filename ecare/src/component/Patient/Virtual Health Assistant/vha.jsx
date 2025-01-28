import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Alert,
  Chip
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import styles from './vha.module.css';

const VirtualHealthAssistant = () => {
  const [healthData, setHealthData] = useState({
    bloodSugar: '',
    systolicBP: '',
    diastolicBP: '',
    temperature: '',
    oxygenLevel: '',
    cholesterol: '',
    weight: '',
    height: '',
    symptoms: []
  });

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [healthHistory, setHealthHistory] = useState([]);

  const steps = ['Enter Health Data', 'AI Analysis', 'Recommendations'];

  const handleInputChange = (field) => (event) => {
    setHealthData({ ...healthData, [field]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/health/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(healthData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setAnalysis(data);
      setActiveStep(2);
      updateHealthHistory();
    } catch (err) {
      setError(err.message || 'Error analyzing health data');
    } finally {
      setLoading(false);
    }
  };

  const renderHealthDataForm = () => (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Blood Sugar (mg/dL)"
            type="number"
            value={healthData.bloodSugar}
            onChange={handleInputChange('bloodSugar')}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Systolic BP (mmHg)"
            type="number"
            value={healthData.systolicBP}
            onChange={handleInputChange('systolicBP')}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Diastolic BP (mmHg)"
            type="number"
            value={healthData.diastolicBP}
            onChange={handleInputChange('diastolicBP')}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Temperature (°F)"
            type="number"
            value={healthData.temperature}
            onChange={handleInputChange('temperature')}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Oxygen Level (%)"
            type="number"
            value={healthData.oxygenLevel}
            onChange={handleInputChange('oxygenLevel')}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Cholesterol (mg/dL)"
            type="number"
            value={healthData.cholesterol}
            onChange={handleInputChange('cholesterol')}
            required
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={styles.submitButton}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Analyze Health Data'}
      </Button>
    </form>
  );

  const renderAnalysis = () => (
    <Box className={styles.analysisContainer}>
      {analysis && (
        <>
          <Timeline position="alternate">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <HealthAndSafetyIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Card className={styles.timelineCard}>
                  <CardContent>
                    <Typography variant="h6">Health Status</Typography>
                    <Typography>{analysis.healthStatus}</Typography>
                    <Box mt={1}>
                      {analysis.riskFactors.map((risk, index) => (
                        <Chip
                          key={index}
                          label={risk}
                          color="warning"
                          variant="outlined"
                          className={styles.chip}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="secondary">
                  <RestaurantIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Card className={styles.timelineCard}>
                  <CardContent>
                    <Typography variant="h6">Diet Recommendations</Typography>
                    <ul className={styles.recommendationList}>
                      {analysis.dietPlan.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="success">
                  <FitnessCenterIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Card className={styles.timelineCard}>
                  <CardContent>
                    <Typography variant="h6">Exercise Plan</Typography>
                    <ul className={styles.recommendationList}>
                      {analysis.exercisePlan.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          </Timeline>

          {analysis.urgentCare && (
            <Alert severity="warning" className={styles.alert}>
              {analysis.urgentCare}
            </Alert>
          )}
        </>
      )}
    </Box>
  );

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom className={styles.title}>
          Virtual Health Assistant
        </Typography>

        <Stepper activeStep={activeStep} className={styles.stepper}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" className={styles.alert}>
            {error}
          </Alert>
        )}

        <Box className={styles.content}>
          {activeStep === 0 && renderHealthDataForm()}
          {activeStep === 2 && renderAnalysis()}
        </Box>
      </Paper>
    </Box>
  );
};

export default VirtualHealthAssistant;
