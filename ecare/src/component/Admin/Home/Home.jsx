import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from 'recharts';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventNoteIcon from '@mui/icons-material/EventNote';
import MedicationIcon from '@mui/icons-material/Medication';
import { getDashboardStats } from '../../../services/adminServices';
import styles from './home.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Home = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    appointmentsByStatus: [],
    appointmentsByDepartment: [],
    recentAppointments: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchDashboardStats();
  }, []);

  const StatCard = ({ icon, title, value, color }) => (
    <Card className={styles.statCard}>
      <Box className={styles.iconWrapper} style={{ backgroundColor: color }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="body2" color="textSecondary">{title}</Typography>
      </Box>
    </Card>
  );

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PersonIcon />}
            title="Total Patients"
            value={stats.totalPatients}
            color="#0088FE"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<LocalHospitalIcon />}
            title="Total Doctors"
            value={stats.totalDoctors}
            color="#00C49F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<EventNoteIcon />}
            title="Total Appointments"
            value={stats.totalAppointments}
            color="#FFBB28"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<MedicationIcon />}
            title="Active Prescriptions"
            value={stats.totalPrescriptions}
            color="#FF8042"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={styles.chartCard}>
            <Typography variant="h6">Appointments by Status</Typography>
            <BarChart width={500} height={300} data={stats.appointmentsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card className={styles.chartCard}>
            <Typography variant="h6">Appointments by Department</Typography>
            <PieChart width={500} height={300}>
              <Pie
                data={stats.appointmentsByDepartment}
                cx={250}
                cy={150}
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.appointmentsByDepartment.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;