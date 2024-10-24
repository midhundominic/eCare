import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams  } from 'react-router-dom';
import { getAppointmentDetails, submitPrescription } from '../../../services/doctorServices';
import { toast } from 'react-toastify';
import {ROUTES} from '../../../router/routes';

const PrescribeForm = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  console.log("appppp",appointmentId);
  const doctorId = searchParams.get('doctorId');
  
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [prescription, setPrescription] = useState({
      medicines: [{ name: '', dosage: '' }],
      notes: '',
      tests: []
    });
  
    useEffect(() => {
      const fetchAppointmentDetails = async () => {
        try {
          const details = await getAppointmentDetails(appointmentId);
          setAppointment(details);
        } catch (error) {
          toast.error('Error fetching appointment details');
        }
      };
      if (appointmentId) {
        fetchAppointmentDetails();
      }
    }, [appointmentId]);

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines[index][field] = value;
    setPrescription({ ...prescription, medicines: updatedMedicines });
  };

  const addMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [...prescription.medicines, { name: '', dosage: '' }]
    });
  };

  const removeMedicine = (index) => {
    const updatedMedicines = prescription.medicines.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medicines: updatedMedicines });
  };

  const handleTestChange = (e) => {
    const { name, checked } = e.target;
    const updatedTests = checked
      ? [...prescription.tests, name]
      : prescription.tests.filter(test => test !== name);
    setPrescription({ ...prescription, tests: updatedTests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitPrescription(appointmentId, prescription);
      toast.success('Prescription submitted successfully');
      navigate(ROUTES.SCHEDULED_APPOINTMENTS);
    } catch (error) {
      toast.error('Error submitting prescription');
    }
  };

  if (!appointment) return <div>Loading...</div>;

  return (
    <div className="prescribe-form">
      <h2>Prescribe for {appointment.patientId.name}</h2>
      <form onSubmit={handleSubmit}>
        <h3>Medicines</h3>
        {prescription.medicines.map((medicine, index) => (
          <div key={index} className="medicine-input">
            <input
              type="text"
              value={medicine.name}
              onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
              placeholder="Medicine name"
            />
            <input
              type="text"
              value={medicine.dosage}
              onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
              placeholder="Dosage"
            />
            <button type="button" onClick={() => removeMedicine(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addMedicine}>Add Medicine</button>

        <h3>Tests</h3>
        <div className="tests-checkboxes">
          <label>
            <input
              type="checkbox"
              name="Blood Test"
              checked={prescription.tests.includes('Blood Test')}
              onChange={handleTestChange}
            />
            Blood Test
          </label>
          <label>
            <input
              type="checkbox"
              name="MRI"
              checked={prescription.tests.includes('MRI')}
              onChange={handleTestChange}
            />
            MRI
          </label>
          <label>
            <input
              type="checkbox"
              name="X-Ray"
              checked={prescription.tests.includes('X-Ray')}
              onChange={handleTestChange}
            />
            X-Ray
          </label>
          <label>
            <input
              type="checkbox"
              name="Urine Test"
              checked={prescription.tests.includes('Urine Test')}
              onChange={handleTestChange}
            />
            Urine Test
          </label>
        </div>

        <h3>Notes</h3>
        <textarea
          value={prescription.notes}
          onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })}
          placeholder="Additional notes"
        />

        <button type="submit">Submit Prescription</button>
      </form>
    </div>
  );
};

export default PrescribeForm;