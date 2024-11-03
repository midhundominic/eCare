import React, { useEffect, useState } from "react";
import { TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";

import styles from "./medicineList.module.css";
import Button from "../../Common/Button";
import { getMedicinesList, addMedicine, updateMedicineStock } from '../../../services/medicineServices';
import PageTitle from "../../Common/PageTitle";

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    stockQuantity: 0,
    price: 0,
    manufacturer: "",
    description: ""
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const medicinesList = await getMedicinesList();
      setMedicines(medicinesList);
    } catch (error) {
      toast.error("Error fetching medicines");
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
        description: ""
      });
      fetchMedicines();
    } catch (error) {
      toast.error("Error adding medicine");
    }
  };

  const handleUpdateStock = async (medicineId, newStock) => {
    try {
      await updateMedicineStock(medicineId, { stockQuantity: newStock });
      toast.success("Stock updated successfully");
      fetchMedicines();
    } catch (error) {
      toast.error("Error updating stock");
    }
  };

  return (
    <div className={styles.medicineRoot}>
      <PageTitle>Medicine Management</PageTitle>
      
      <form onSubmit={handleAddMedicine} className={styles.addMedicineForm}>
        <TextField
          label="Medicine Name"
          value={newMedicine.name}
          onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
          required
        />
        <TextField
          label="Stock Quantity"
          type="number"
          value={newMedicine.stockQuantity}
          onChange={(e) => setNewMedicine({...newMedicine, stockQuantity: parseInt(e.target.value)})}
          required
        />
        <TextField
          label="Price"
          type="number"
          value={newMedicine.price}
          onChange={(e) => setNewMedicine({...newMedicine, price: parseFloat(e.target.value)})}
          required
        />
        <TextField
          label="Manufacturer"
          value={newMedicine.manufacturer}
          onChange={(e) => setNewMedicine({...newMedicine, manufacturer: e.target.value})}
        />
        <TextField
          label="Description"
          multiline
          rows={3}
          value={newMedicine.description}
          onChange={(e) => setNewMedicine({...newMedicine, description: e.target.value})}
        />
        <Button type="submit">Add Medicine</Button>
      </form>

      <div className={styles.medicineList}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Manufacturer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine._id}>
                <td>{medicine.name}</td>
                <td>
                  <TextField
                    type="number"
                    value={medicine.stockQuantity}
                    onChange={(e) => handleUpdateStock(medicine._id, parseInt(e.target.value))}
                    size="small"
                  />
                </td>
                <td>₹{medicine.price}</td>
                <td>{medicine.manufacturer}</td>
                <td>
                  <IconButton onClick={() => handleUpdateStock(medicine._id, medicine.stockQuantity + 1)}>
                    +
                  </IconButton>
                  <IconButton onClick={() => handleUpdateStock(medicine._id, Math.max(0, medicine.stockQuantity - 1))}>
                    -
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineList;