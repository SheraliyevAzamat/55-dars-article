const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateJWT = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User Registered");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });  
    res.json({ token });
  });
router.get("/profile", authenticateJWT, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password"); 
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({
    username: user.username,
    email: user.email,
  });
});

module.exports = router;
