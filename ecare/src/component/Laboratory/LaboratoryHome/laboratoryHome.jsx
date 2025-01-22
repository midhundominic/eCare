import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Science,
  Assignment,
  Timeline,
  Notifications,
  MedicalServices,
  LocalHospital
} from '@mui/icons-material';
import styles from './laboratoryHome.module.css';

const LaboratoryHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingTests: 0,
    completedTests: 0,
    totalPatients: 0,
    recentReports: []
  });

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        pendingTests: 15,
        completedTests: 45,
        totalPatients: 60,
        recentReports: [
          { id: 1, patientName: 'John Doe', testType: 'Blood Test', date: '2024-03-20' },
          { id: 2, patientName: 'Jane Smith', testType: 'X-Ray', date: '2024-03-19' },
          { id: 3, patientName: 'Mike Johnson', testType: 'MRI Scan', date: '2024-03-18' }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    { title: 'New Test', icon: <Science />, color: '#4CAF50', path: '/new-test' },
    { title: 'View Reports', icon: <Assignment />, color: '#2196F3', path: '/reports' },
    { title: 'Analytics', icon: <Timeline />, color: '#9C27B0', path: '/analytics' },
    { title: 'Notifications', icon: <Notifications />, color: '#FF9800', path: '/notifications' }
  ];

  const services = [
    {
      title: 'Blood Tests',
      description: 'Complete blood work analysis including CBC, lipid profile, and more.',
      icon: '/images/blood-test.jpg'
    },
    {
      title: 'Imaging Services',
      description: 'X-rays, MRI scans, CT scans, and ultrasound services.',
      icon: '/images/imaging.jpg'
    },
    {
      title: 'Pathology',
      description: 'Comprehensive pathology services for accurate diagnosis.',
      icon: '/images/pathology.jpg'
    },
    {
      title: 'Special Tests',
      description: 'Specialized diagnostic tests and health screenings.',
      icon: '/images/special-tests.jpg'
    }
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      {/* Welcome Banner */}
      <Paper elevation={3} className={styles.welcomeBanner}>
        <div className={styles.welcomeContent}>
          <Typography variant="h4">Welcome to Laboratory Management</Typography>
          <Typography variant="subtitle1">
            Manage your laboratory operations efficiently and effectively
          </Typography>
        </div>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} className={styles.statsContainer}>
        <Grid item xs={12} md={4}>
          <Card className={styles.statCard}>
            <CardContent>
              <LocalHospital className={styles.statIcon} />
              <Typography variant="h6">Pending Tests</Typography>
              <Typography variant="h4">{stats.pendingTests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={styles.statCard}>
            <CardContent>
              <MedicalServices className={styles.statIcon} />
              <Typography variant="h6">Completed Tests</Typography>
              <Typography variant="h4">{stats.completedTests}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className={styles.statCard}>
            <CardContent>
              <Assignment className={styles.statIcon} />
              <Typography variant="h6">Total Patients</Typography>
              <Typography variant="h4">{stats.totalPatients}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h5" className={styles.sectionTitle}>
        Quick Actions
      </Typography>
      <Grid container spacing={3} className={styles.actionsContainer}>
        {quickActions.map((action, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card 
              className={styles.actionCard}
              onClick={() => navigate(action.path)}
            >
              <CardContent>
                <IconButton style={{ backgroundColor: action.color }}>
                  {action.icon}
                </IconButton>
                <Typography variant="h6">{action.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Services */}
      <Typography variant="h5" className={styles.sectionTitle}>
        Our Services
      </Typography>
      <Grid container spacing={3} className={styles.servicesContainer}>
        {services.map((service, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Card className={styles.serviceCard}>
              <img src={service.icon} alt={service.title} className={styles.serviceImage} />
              <CardContent>
                <Typography variant="h6">{service.title}</Typography>
                <Typography variant="body2">{service.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Reports */}
      <Typography variant="h5" className={styles.sectionTitle}>
        Recent Reports
      </Typography>
      <Card className={styles.reportsCard}>
        <CardContent>
          {stats.recentReports.map((report) => (
            <div key={report.id} className={styles.reportItem}>
              <div>
                <Typography variant="subtitle1">{report.patientName}</Typography>
                <Typography variant="body2">{report.testType}</Typography>
              </div>
              <Typography variant="body2">{report.date}</Typography>
              <Button variant="outlined" size="small">
                View Report
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LaboratoryHome;
