// controllers/authControllers.js
const UserModel = require('../models/UserModel'); // Update to your model's path

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
     return res.status(400).json({ message: 'All fields are required' });
  }

  try {
     // Check if user already exists
     const existingUser = await UserModel.findOne({ email });
     if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
     }

     // Create a new user
     const newUser = new UserModel({
        name,
        email,
        password
     });

     // Save the user
     await newUser.save();

     res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
     res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { signup };
