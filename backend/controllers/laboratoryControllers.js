const LaboratoryModel = require("../models/laboratoryModel");


const registerLaboratory = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const PharmacistExist = await LaboratoryModel.findOne({ email });
    if (PharmacistExist) {
      return res.status(400).json({ message: "LaboratoryModel already Exists" });
    }

    const newPharmacist = new LaboratoryModel({
      name,
      email,
      password,
      role: 4,
    });

    await newPharmacist.save();

    res.status(201).json({ message: "LaboratoryModel registered successully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllLaboratory = async (req, res) => {
  try {
    const pharmacist = await LaboratoryModel.find({});
    res.status(201).json({ data: pharmacist });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


module.exports = {
  registerLaboratory,
  getAllLaboratory
}