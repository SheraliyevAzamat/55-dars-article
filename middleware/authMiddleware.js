const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(403).json({ message: "No token, authorization denied" }); 
  }

  if (!token.startsWith('Bearer ')) {
    return res.status(403).json({ message: "Token format is incorrect" });
  }

  const jwtToken = token.split(' ')[1]; 

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" }); 
    }
    req.user = user;
    next(); 
  });
};

module.exports = authenticateJWT;
