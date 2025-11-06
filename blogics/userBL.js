const db = require("../db/db");
const StringStore = require("../constants/constants");
const { isEmpty } = require('./commons');


// 📌 Confirm a user
const confirmUser = (req, res) => {
   return res.status(200).json({ success: true, message: StringStore.WELCOME_USER, user: req.user });
}

// 📌 Update a user
const updateUser = (req, res) => {
   const { id, interest, membership } = req.body;
   try {
      if (isEmpty(id) || isEmpty(interest) || isEmpty(membership)) {
         return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      const role = 'member';
      const query = `UPDATE users SET interest = ?, membership = ?, role = ? WHERE id = ?`;

      db.query(query, [interest, membership, role, id], (err, results) => {
         if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ success: false, message: err });
         }
         return res.status(200).json({ success: true, data: results });
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Get all users
const getAllUsers = async (req, res) => {
   try {
      const query = "SELECT * FROM users WHERE role = 'user'";
      db.query(query, (err, results) => {
         if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: err })
         }
         const formattedResults = results.map(user => ({
            ...user,
            deactivate: user.deactivate,
            deleted: user.deleted,
         }))
         return res.status(200).json({ success: true, data: formattedResults })
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Get all registered accounts/users
const getAllAccounts = async (req, res) => {
   try {
      const query = "SELECT * FROM users ORDER BY createdAt DESC";
      db.query(query, (err, results) => {
         if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ success: false, message: err })
         }
         const formattedResults = results.map(user => ({
            ...user,
            deactivate: user.deactivate,
            deleted: user.deleted,
         }))
         return res.status(200).json({ success: true, data: formattedResults })
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Delete a user
const deletUser = async (req, res) => {
   const {id} = req.body;
   try {
      if (isEmpty(id)) {
         return res.status(400).json({ success: false, message: 'Please provide a User ID.' });
      }
      const query = "DELETE FROM users WHERE id = ?";
      db.query(query, [id], (err, results) => {
         if (err) {
            console.error(`Error deleting record from users:`, err);
            return res.status(500).json({ success: false, message: err })
         }
         return res.status(200).json({ success: true, message: 'User has been deleted successfully.' })
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Exporting all functions
module.exports = { confirmUser, updateUser, getAllUsers, deletUser,getAllAccounts };