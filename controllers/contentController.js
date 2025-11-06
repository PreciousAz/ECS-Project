const express = require("express");
const verifyToken = require('../verifications/authMiddleware');
const router = express.Router();
const {createContent,updateContent,getContent,getAllContents,deleteContent} = require('../blogics/content');

 // 📌 Create module endpoint
router.post('/api/content/create', createContent);

 // 📌 Get all modules endpoint
router.get('/api/content/all', getAllContents);

 // 📌 Update module endpoint
router.patch('/api/content/update/:id', updateContent);

 // 📌 Get a module endpoint
router.get('/api/content/:id', getContent);

 // 📌 Delete module endpoint
router.delete('/api/content/remove/:id', deleteContent);


 // 📌 Exporting this router
module.exports = router;