const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const StringStore = require("../constants/constants");
const { isEmpty } = require('./commons');


// 📌 Register user function
const registerUser = (req, res) => {
  const { name, username, phone, email, password, dob } = req.body;
  try {
    if (isEmpty(name) || isEmpty(username) || isEmpty(phone) || isEmpty(email) || isEmpty(password) || isEmpty(dob)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = "INSERT INTO users (name,username, phone, email, password, dob, role) VALUES (?, ?, ?,?,?,?, 'user')";
    db.query(sql, [name, username, phone, email, hashedPassword, dob], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err });
      res.status(200).json({ success: true, message: StringStore.SIGNUP_SUCCESS });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
  }
};

// 📌 Login user function
const loginUser = (req, res) => {
  const { email, password } = req.body;
  try {
    if (isEmpty(email) || isEmpty(password)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
      if (err || result.length === 0) return res.status(404).json({ success: false, message: StringStore.USER_NOT_FOUND });

      const user = result[0];
      if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ success: false, message: StringStore.INVALID_CRED });

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const fomarttedUser = {...user, deleted:!!user.deleted,deactivate:!!user.deactivate};
     return res.status(200).json({ success: true, message: StringStore.LOGIN_SUCCESS, data: { token, user:fomarttedUser } });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
  }
};

// 📌 Update user function
const updateUser = (req, res) => {
  const {id} = req.params;
  const { name, phone } = req.body;
  try {
    if (isEmpty(id) || isEmpty(name) || isEmpty(phone)) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const sql = "UPDATE users SET name = ?, phone = ? WHERE id = ?";
    db.query(sql, [name,phone,id], (err, result) => {
      if (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ success: false, message: err });
     }
     return res.status(200).json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
  }
};

// 📌 Verify user token
const verifyToken = (req, res) => {
  const token = req.query.token;
  try {
    if (isEmpty(token)) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }
    const expired = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ success: true, expired: false, message: 'Token is still valid' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      const { id, email } = jwt.decode(token);
      const token = jwt.sign({ id: id, email: email }, process.env.JWT_SECRET, { expiresIn: "1h" });
     return res.status(500).json({ success: false, expired: true, token });
    }
   return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
  }
}

// 📌 Exporting all functions
module.exports = { registerUser, loginUser, verifyToken,updateUser };