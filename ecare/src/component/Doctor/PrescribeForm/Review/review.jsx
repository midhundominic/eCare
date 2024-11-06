import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, TextField } from "@mui/material";
import { toast } from "react-toastify";

import styles from "./review.module.css";
import AutoCompleteInput from "../../../Common/AutoComplete/autoComplete";
import { FREQUENCY, INITIAL_MEDICINE_ARR, MEDICAL_TESTS } from "../constants";
import Checkbox from "../../../Common/Checkbox";
import Button from "../../../Common/Button";
import { ROUTES } from "../../../../router/routes";
import { getMedicinesList } from "../../../../services/medicineservices";
import { submitPrescription,updatePrescription,getPrescriptionByAppointment } from "../../../../services/prescriptionServices";


const DoctorReview = () => {
  const [comment, setComment] = useState("");
  const [tests, setTests] = useState([]);
  const [medicines, setMedicines] = useState(INITIAL_MEDICINE_ARR);
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isUpdateMode = searchParams.get("mode") === "update";
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch medicines list
        const medicinesList = await getMedicinesList();
        setMedicineOptions(
          medicinesList.map((med) => ({
            label: med.name,
            value: med._id,
            stock: med.stockQuantity,
          }))
        );

        // If update mode, fetch existing prescription
        if (isUpdateMode && appointmentId) {
          const response = await getPrescriptionByAppointment(appointmentId);
          const prescriptionData = response.data;

          if (prescriptionData) {
            setComment(prescriptionData.notes || '');
            setTests(prescriptionData.tests.map(test => test.testName));
            
            const formattedMedicines = prescriptionData.medicines.map(med => ({
              name: {
                label: med.medicine.name,
                value: med.medicine._id
              },
              frequency: med.frequency,
              days: med.days.toString(),
              isSOS: med.isSOS || false,
              bf: med.beforeFood || false
            }));
            
            setMedicines([...formattedMedicines, ...INITIAL_MEDICINE_ARR]);
          }
        }
      } catch (error) {
        toast.error("Error fetching prescription data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isUpdateMode, appointmentId]);

  const removeMedicine = (index) => {
    const updatedMedicines = medicines.filter((_, idx) => idx !== index);
    setMedicines(updatedMedicines);
  };

  const handleTestChange = (e) => {
    const { name, checked } = e.target;
    const updatedTests = checked
      ? [...tests, name]
      : tests.filter((test) => test !== name);
    setTests(updatedTests);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const prescriptionData = {
      medicines: medicines
        .filter((med) => med.name?.value)
        .map((med) => ({
          medicine: med.name.value,
          frequency: med.frequency,
          days: parseInt(med.days),
          isSOS: med.isSOS || false,
          beforeFood: med.bf || false,
        })),
      tests: tests.map(test => ({
        testName: test,
        isCompleted: false
      })),
      notes: comment,
    };

    try {
      if (isUpdateMode) {
        await updatePrescription(appointmentId, prescriptionData);
        toast.success("Prescription updated successfully");
      } else {
        await submitPrescription({
          ...prescriptionData,
          appointmentId: appointmentId,
          doctorId: searchParams.get("doctorId"),
        });
        toast.success("Prescription submitted successfully");
      }
      navigate(ROUTES.SCHEDULED_APPOINTMENTS);
    } catch (error) {
      toast.error(error.response?.data?.message || `Error ${isUpdateMode ? 'updating' : 'submitting'} prescription`);
    }
  };

  const handleChangeMedicine = (newValue, name, index) => {
    let updatedItems = [...medicines];
    if (updatedItems[index]) {
      if (name === "name") {
        // Store both label and value for medicine
        updatedItems[index] = {
          ...updatedItems[index],
          name: {
            label: newValue.label,
            value: newValue.value
          }
        };
      } else {
        updatedItems[index] = { 
          ...updatedItems[index], 
          [name]: newValue.value 
        };
      }
    }
  
    if (index === medicines.length - 1 && name === "name") {
      updatedItems = [...updatedItems, ...INITIAL_MEDICINE_ARR];
    }
  
    setMedicines(updatedItems);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.reviewRoot}>
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div className={styles.section}>
          <span className={styles.caption}>Comment</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.reviewTextArea}
            placeholder="Additional notes"
          />
        </div>
        <div className={styles.section}>
          <span className={styles.caption}>Medicines</span>
          {medicines.map((medicine, index) => (
            <div key={index} className={styles.medicineRow}>
              <AutoCompleteInput
                options={medicineOptions}
                label="Medicine"
                value={medicine.name?.label || ""}
                handleChange={(event, newValue) =>
                  handleChangeMedicine(newValue, "name", index)
                }
              />
              <AutoCompleteInput
                options={FREQUENCY}
                label="Frequency"
                value={medicine.frequency}
                handleChange={(event, newValue) =>
                  handleChangeMedicine(newValue, "frequency", index)
                }
              />
              <TextField
                id="outlined-basic"
                label="Days"
                variant="outlined"
                value={medicine.days}
                size="small"
                classes={{ root: styles.customeTextInput }}
                onChange={(e) =>
                  handleChangeMedicine({ value: e.target.value }, "days", index)
                }
              />
              <Checkbox
                name="bf"
                title="Before food"
                value={medicine.bf}
                onChange={(e) =>
                  handleChangeMedicine({ value: e.target.checked }, "bf", index)
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    onChange={(e) =>
                      handleChangeMedicine(
                        { value: e.target.checked },
                        "isSOS",
                        index
                      )
                    }
                  />
                }
                label="SOS"
              />
              <IconButton
                onClick={() => removeMedicine(index)}
                disabled={index === medicines.length - 1}
                className={styles.deleteIcon}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
        <div className={styles.section}>
          <span className={styles.caption}>Tests</span>
          <div className={styles.medicalTests}>
            {MEDICAL_TESTS.map((test) => {
              return (
                <Checkbox
                  name={test.label}
                  title={test.label}
                  key={test.id}
                  onChange={handleTestChange}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.btnContainer}>
          <Button type="submit" styles={{ btnPrimary: styles.customBtn }}>
            Submit Prescription
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DoctorReview;
