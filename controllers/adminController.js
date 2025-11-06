const messages = require('../locales/en.json');
const config = require('../config.json');
const express = require("express");
const verifyToken = require('../verifications/authMiddleware');
const router = express.Router();
const {confirmAdmin,verifyAdmin} = require('../blogics/adminBL');

  // 📌 Protect Admin Route
  router.get("/api/admin", verifyToken, verifyAdmin, confirmAdmin);

  // 📌 Exporting this router
  module.exports = router;