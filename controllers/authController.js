const express = require('express');
const router = express.Router();
const {registerUser,loginUser, verifyToken,updateUser} = require('../blogics/account');

 // 📌 Create user endpoint
router.post('/api/createaccount',registerUser);

 // 📌 Login user endpoint
router.post('/api/login',loginUser);

 // 📌 Verify user token endpoint
router.post('/api/verify', verifyToken);

 // 📌 Update user endpoint
router.patch('/api/update/:id', updateUser);



 // 📌 Exporting this router
module.exports = router;