const adminSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const ADMIN_EMAIL = "admin@ecare.com";
  const ADMIN_PASSWORD = "admin123";

  try {
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ message: "Admin not found" });
    }

    if (ADMIN_PASSWORD !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    return res.status(201).json({
      message: "Login Successful",
      data: { role: 0, name: "Admin", email: ADMIN_EMAIL },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  adminSignin,
};
