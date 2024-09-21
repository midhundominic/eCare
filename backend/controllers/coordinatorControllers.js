const CoordinatorModel = require("../models/coordinatorModel");

const registerCoordinator = async (req, res) => {
  const { firstName, lastName, gender, email, phone, password } = req.body;

  if (!firstName || !lastName || !gender || !email || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const coordinatorExixts = await CoordinatorModel.findOne({ email });
    if (coordinatorExixts) {
      return res.status(400).json({ message: "Coordinator already Exists" });
    }

    const newCoordinator = new CoordinatorModel({
      firstName,
      lastName,
      gender,
      email,
      phone,
      password,
      role: 3,
    });

    await newCoordinator.save();

    res.status(201).json({ message: "Coordinator registered successully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllCoordinator = async (req, res) => {
  try {
    const coordinator = await CoordinatorModel.find({});
    res.status(201).json({ data: coordinator });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  registerCoordinator,
  getAllCoordinator,
};
