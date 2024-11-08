import React, { useEffect, useState } from "react";
import {
  TextField,
  IconButton,
  Card,
  Grid,
  Typography,
  Paper,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

import styles from "./medicineList.module.css";
import Button from "../../Common/Button";
import PageTitle from "../../Common/PageTitle";
import {
  getMedicinesList,
  addMedicine,
  updateMedicineStock,
  deleteMedicine,
} from "../../../services/medicineservices";

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    stockQuantity: 0,
    price: 0,
    manufacturer: "",
    description: "",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const medicinesList = await getMedicinesList();
      setMedicines(medicinesList);
    } catch (error) {
      toast.error("Error fetching medicines");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (medicineId, newStock) => {
    try {
      await updateMedicineStock(medicineId, { stockQuantity: newStock });
      fetchMedicines();
    } catch (error) {
      toast.error("Error updating stock");
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      await deleteMedicine(medicineId);
      toast.success("Medicine deleted successfully");
      fetchMedicines(); // Refresh the list
    } catch (error) {
      toast.error("Error deleting medicine");
    }
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      await addMedicine(newMedicine);
      toast.success("Medicine added successfully");
      setNewMedicine({
        name: "",
        stockQuantity: 0,
        price: 0,
        manufacturer: "",
        description: "",
      });
      setOpenDialog(false);
      fetchMedicines();
    } catch (error) {
      toast.error("Error adding medicine");
    }
  };

  const filteredMedicines = medicines.filter(medicine => 
    (medicine?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     medicine?.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
  );

  return (
    <div className={styles.medicineRoot}>
      <PageTitle>Medicine Management</PageTitle>

      <div className={styles.toolbarSection}>
        <TextField
          placeholder="Search medicines..."
          variant="outlined"
          size="small"
          className={styles.searchField}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Fab
          color="primary"
          className={styles.addButton}
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3} className={styles.medicineGrid}>
          {filteredMedicines.map((medicine) => (
            <Grid item xs={12} sm={6} md={4} key={medicine._id}>
              <Card className={styles.medicineCard}>
                <div className={styles.cardHeader}>
                  <Typography variant="h6">{medicine.name}</Typography>
                  <div
                    className={styles.stockIndicator}
                    style={{
                      backgroundColor:
                        medicine.stockQuantity > 10 ? "#4caf50" : "#ff9800",
                    }}
                  >
                    {medicine.stockQuantity} in stock
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <Typography variant="body2" color="textSecondary">
                    Manufacturer: {medicine.manufacturer}
                  </Typography>
                  <Typography variant="h6" className={styles.price}>
                    ₹{medicine.price}
                  </Typography>
                  <Typography variant="body2" className={styles.description}>
                    {medicine.description}
                  </Typography>
                </div>

                <div className={styles.cardActions}>
                  <div className={styles.stockControls}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateStock(
                          medicine._id,
                          Math.max(0, medicine.stockQuantity - 1)
                        )
                      }
                    >
                      -
                    </IconButton>
                    <TextField
                      type="number"
                      value={medicine.stockQuantity}
                      onChange={(e) =>
                        handleUpdateStock(
                          medicine._id,
                          parseInt(e.target.value)
                        )
                      }
                      size="small"
                      className={styles.stockInput}
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleUpdateStock(
                          medicine._id,
                          medicine.stockQuantity + 1
                        )
                      }
                    >
                      +
                    </IconButton>
                  </div>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteMedicine(medicine._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Medicine</DialogTitle>
        <form onSubmit={handleAddMedicine}>
          <DialogContent dividers>
            <TextField
              label="Medicine Name"
              value={newMedicine.name}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, name: e.target.value })
              }
              fullWidth
              required
              margin="dense"
            />
            <TextField
              label="Stock Quantity"
              type="number"
              value={newMedicine.stockQuantity}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  stockQuantity: parseInt(e.target.value),
                })
              }
              fullWidth
              required
              margin="dense"
            />
            <TextField
              label="Price"
              type="number"
              value={newMedicine.price}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  price: parseFloat(e.target.value),
                })
              }
              fullWidth
              required
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Manufacturer"
              value={newMedicine.manufacturer}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, manufacturer: e.target.value })
              }
              fullWidth
              margin="dense"
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={newMedicine.description}
              onChange={(e) =>
                setNewMedicine({ ...newMedicine, description: e.target.value })
              }
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add Medicine
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default MedicineList;
