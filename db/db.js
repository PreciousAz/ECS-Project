const mysql = require("mysql");
const mysql2 = require("mysql2");
require("dotenv").config();
const StringStore = require("../constants/constants");

// 📌 Creating database connection
const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  //database: process.env.DB_NAME
});

// 📌 Connecting to database
db.connect((err, result) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ MySQL Connected!");
  db.query('CREATE DATABASE IF NOT EXISTS culture', (err, result) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("✅ Database Created");
    db.changeUser({ database: 'culture' }, (err, result) => {
      if (err) {
        console.error("Database connection failed:", err);
        return;
      }
      createTable();
      CreateMemberRequestTable();
      CreateEventsTable();
      CreateContentTable();
      CreateEventBookingTable();
      CreateBenefitTable();
    })
  })
});

// 📌 Create users table if not exists
function createTable() {
  db.query(`CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role ENUM('admin', 'member', 'user') DEFAULT 'user',
    password VARCHAR(255) NOT NULL,
    membership VARCHAR(100) NULL,
    interest VARCHAR(100) NULL,
    dob VARCHAR(50) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    deactivate BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err, result) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("✅ user table Created");
  });
}

// 📌 Create member request table if not exists
function CreateMemberRequestTable() {
  db.query(`CREATE TABLE IF NOT EXISTS member_request (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    membership VARCHAR(100) NOT NULL,
    interest VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err, result) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("✅ member_request table Created");
  });
}

// 📌 Create events table if not exists
function CreateEventsTable() {
  db.query(`CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    organizer_name VARCHAR(255) NOT NULL,
    event_image VARCHAR(255) NOT NULL,
    event_interest VARCHAR(255) NOT NULL,
    event_desc VARCHAR(255) NOT NULL,
    event_benefit VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err, result) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("✅ events table Created");
  });
}

// 📌 Create contents table if not exists
function CreateContentTable() {
  db.query(`CREATE TABLE IF NOT EXISTS contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    module_name VARCHAR(255) NOT NULL,
    module_image VARCHAR(255) NOT NULL,
    module_interest VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`, (err, result) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("✅ contents table Created");
  });
}

// 📌 Create event booking table if not exists
function CreateEventBookingTable() {
  db.query(`CREATE TABLE IF NOT EXISTS event_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    booking_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`, (err, result) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("✅ event_bookings table Created");
  });
  ;
}


// 📌 Create benefits table if not exists
function CreateBenefitTable() {
  db.query(`CREATE TABLE IF NOT EXISTS benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    benefit VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)`, (err, result) => {
    if (err) {
      console.error("Database connection failed:", err);
      return;
    }
    console.log("✅ benefits table Created");
  });
  ;
}

// 📌 Exporting this db 
module.exports = db;