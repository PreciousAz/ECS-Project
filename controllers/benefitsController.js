const express = require("express");
const router = express.Router();
const { createBenefit, getBenefit, getAllBenefits} = require('../blogics/benefits')


// 📌 Add benefits endpoint
router.post("/api/benefits", createBenefit);

 // 📌 Get all benefits endpoint
router.get('/api/benefits/all', getAllBenefits);

 // 📌 Get benefit id endpoint
router.get('/api/benefits/:id', getBenefit)



module.exports = router