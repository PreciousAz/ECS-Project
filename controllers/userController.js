const express = require("express");
const verifyToken = require('../verifications/authMiddleware');
const router = express.Router();
const { confirmUser, updateUser, getAllUsers, deletUser,getAllAccounts } = require('../blogics/userBL');

 // 📌 Verify user endpoint endpoint
router.get("/api/user", confirmUser);

 // 📌 Get all users endpoint
router.get('/api/user/all', getAllUsers);

 // 📌 Get all accounts endpoint
router.get('/api/user/all-accounts', getAllAccounts);

 // 📌 Update endpoint
router.patch('/api/user/update',updateUser);

 // 📌 Delete user endpoint
router.delete('/api/user/remove', deletUser);



 // 📌 Exporting this router
module.exports = router;