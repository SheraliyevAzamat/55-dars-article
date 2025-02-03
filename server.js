const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/blogApp", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

  const jwtSecret = process.env.JWT_SECRET;
  
app.use("/api/auth", authRoutes); 
app.use("/api/articles", articleRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
