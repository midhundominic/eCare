const Medicine = require('../models/medicineModel');

exports.addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMedicinesList = async (req, res) => {
  try {
    const medicines = await Medicine.find().select('name stockQuantity price');
    res.status(201).json(medicines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMedicineStock = async (req, res) => {
  try {
    const { id, stockQuantity } = req.body;
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { stockQuantity },
      { new: true }
    );
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};