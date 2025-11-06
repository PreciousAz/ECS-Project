const jwt = require("jsonwebtoken");
const StringStore = require("../constants/constants");

// 📌 Verify user token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer Token

  if (!token) return res.status(401).json({success:false, message: StringStore.ACCESS_DENIED });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify Token
    req.user = verified; // Attach User Data to Request
    next();
  } catch (err) {
    res.status(403).json({success:false, message: StringStore.INVALID_TOKEN });
  }
};

// 📌 Exporting verify functions
module.exports = verifyToken;
