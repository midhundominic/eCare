import React, { useState, useEffect } from "react";
import { Switch, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./doctorUserList.module.css";
import PageTitle from '../../../Common/PageTitle';

const DoctorUserList = ({ fetchDoctors, toggleDoctorStatus, editDoctorDetails, registerDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const fetchedDoctors = await fetchDoctors();
      setDoctors(fetchedDoctors.map(doctor => ({ ...doctor, isDisabled: doctor.isDisabled || false })));
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Error fetching doctors");
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus;
      await toggleDoctorStatus(id, updatedStatus);
      setDoctors(doctors.map(doctor => doctor._id === id ? { ...doctor, isDisabled: updatedStatus } : doctor));
      toast.success(`Doctor ${updatedStatus ? "disabled" : "enabled"} successfully`);
    } catch (error) {
      console.error("Error updating doctor status:", error);
      toast.error("Error updating doctor status");
    }
  };

  const handleEdit = (doctor) => setEditingDoctor({ ...doctor });

  const handleSave = async () => {
    try {
      await editDoctorDetails(editingDoctor._id, editingDoctor);
      setDoctors(doctors.map(doctor => doctor._id === editingDoctor._id ? editingDoctor : doctor));
      setEditingDoctor(null);
      toast.success("Doctor details updated successfully");
    } catch (error) {
      toast.error("Error updating doctor details");
    }
  };

  const filteredDoctors = doctors.filter(
    doctor =>
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.doctorUserListContainer}>
      <div className={styles.searchContainer}>
        <TextField
          label="Search"
          name="search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchField}
        />
        <Button variant="contained" color="primary" onClick={registerDoctor} id="registerButton" className={styles.registerButton}>
          Register Doctor
        </Button>
      </div>
      <PageTitle>Doctors</PageTitle>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Specialization</TableCell>
            <TableCell>Years of Experience</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Password</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Date Created</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDoctors.map(doctor => (
            <TableRow key={doctor._id}>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <>
                  <TextField
                    value={editingDoctor.firstName}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, firstName: e.target.value })}
                    placeholder="First Name"
                  />
                  <TextField
                    value={editingDoctor.lastName}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, lastName: e.target.value })}
                    placeholder="Last Name"
                  />
                </>
              ) : `${doctor.firstName} ${doctor.lastName}`}</TableCell>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <TextField
                  value={editingDoctor.email}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                />
              ) : doctor.email}</TableCell>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <TextField
                  value={editingDoctor.specialization}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialization: e.target.value })}
                />
              ) : doctor.specialization}</TableCell>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <TextField
                  value={editingDoctor.y_experience}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, y_experience: e.target.value })}
                />
              ) : doctor.y_experience}</TableCell>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <Select
                  value={editingDoctor.gender}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              ) : doctor.gender}</TableCell>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <TextField
                  value={editingDoctor.phone}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, phone: e.target.value })}
                />
              ) : doctor.phone}</TableCell>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <TextField
                  value={editingDoctor.password}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, password: e.target.value })}
                  type="password"
                />
              ) : "********"}</TableCell>
              <TableCell>{editingDoctor && editingDoctor._id === doctor._id ? (
                <TextField
                  value={editingDoctor.aboutDoctor || ""}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, aboutDoctor: e.target.value })}
                  multiline
                  rows={3}
                />
              ) : doctor.aboutDoctor}</TableCell>
              <TableCell>{doctor.date_created ? new Date(doctor.date_created).toLocaleDateString() : "N/A"}</TableCell>
              <TableCell>
                {editingDoctor && editingDoctor._id === doctor._id ? (
                  <>
                    <Button onClick={handleSave} variant="contained" color="primary" size="small">
                      Save
                    </Button>
                    <Button onClick={() => setEditingDoctor(null)} variant="outlined" color="secondary" size="small">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleEdit(doctor)}>
                      <EditIcon />
                    </IconButton>
                    <Switch
                      checked={!doctor.isDisabled}
                      onChange={() => handleToggle(doctor._id, doctor.isDisabled)}
                      color="primary"
                    />
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DoctorUserList;
