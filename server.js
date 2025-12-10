const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require("express-session");

const authRoute = require("./controllers/authController");
const adminRoute = require("./controllers/adminController");
const userRoute = require("./controllers/userController");
const memberRoute = require('./controllers/memberController');
const eventRoute = require('./controllers/eventController');
const contentRoute = require('./controllers/contentController');
const uploadRoute = require('./controllers/uploadController');
const bookingRoute = require('./controllers/bookingController');
const benefitsRoute = require('./controllers/benefitsController');

const path = require('path');
require("dotenv").config();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(authRoute);
app.use(adminRoute);
app.use(userRoute);
app.use(memberRoute);
app.use(eventRoute);
app.use(contentRoute);
app.use(uploadRoute);
app.use(bookingRoute);
app.use(benefitsRoute);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
    console.log("✅ Server running on port", PORT)
})

// health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

//npm install express mysql dotenv bcryptjs jsonwebtoken express-session cors body-parser //required dependecies

/* company-website
│── /public
│   ├── /css  (Styles)
│   ├── /js  (Frontend Scripts)
│   ├── /images  (Assets)
│── /views
│   ├── index.html  (Homepage)
│   ├── login.html  (Login Page)
│   ├── signup.html  (Signup Page)
│   ├── dashboard.html  (User Dashboard)
│   ├── admin.html  (Admin Panel)
│── /backend
│   ├── server.js  (Main Server)
│   ├── db.js  (MySQL Connection)
│   ├── auth.js  (Authentication Logic)
│   ├── userRoutes.js  (User APIs)
│   ├── adminRoutes.js  (Admin APIs)
│── package.json
│── .env
│── README.md */
