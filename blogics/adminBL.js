const db = require("../db/db");
const StringStore = require("../constants/constants");

// 📌 Confirm admin, but not in effect
const confirmAdmin = (req,res)=>{
    res.status(200).json({success:true, message: StringStore.WELCOME_ADMIN });
}

// 📌 Verify admin, but in effect
const verifyAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({sucess:false, message: StringStore.ADMINS_ONLY });
    }
    next();
  };

  
// 📌 Exporting all functions
module.exports = {confirmAdmin,verifyAdmin};