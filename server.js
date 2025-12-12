const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);


app.use(require("./controllers/authController"));
app.use(require("./controllers/adminController"));
app.use(require("./controllers/userController"));
app.use(require("./controllers/memberController"));
app.use(require("./controllers/eventController"));
app.use(require("./controllers/contentController"));
app.use(require("./controllers/uploadController"));
app.use(require("./controllers/bookingController"));
app.use(require("./controllers/benefitsController"));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/**
 * =========================
 * START SERVER
 * =========================
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
