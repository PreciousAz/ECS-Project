const db = require("../db/db");
const StringStore = require("../constants/constants");
const { isEmpty } = require('./commons');

// 📌 Request to be a member
const memberRequest = (req, res) => {
   const { userId, name, email, interest, membership } = req.body;
   try {
      if (isEmpty(userId) || isEmpty(email) || isEmpty(interest) || isEmpty(membership) || isEmpty(name)) {
         return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      const sql = "INSERT INTO member_request (userId, name, email, interest, membership) VALUES (?, ?, ?, ?, ?)";
      db.query(sql, [userId, name, email, interest, membership], (err, result) => {
         if (err) return res.status(500).json({ success: false, message: err });
         res.status(200).json({ success: true, message: 'Request successfully sent' });
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
};

// 📌 Get all member requests
const getAllMemberRequest = async (req, res) => {
   try {
      const query = "SELECT * FROM member_request";
      db.query(query, (err, results) => {
         if (err) {
            console.error('Error fetching members:', err);
            return res.status(500).json({ success: false, message: err })
         }
         return res.status(200).json({ success: true, data: results })
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Delete a request
const deletMemberRequest = async (req, res) => {
   const { id, email } = req.body;
   try {
      if (isEmpty(id) || isEmpty(email)) {
         return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      const query = "DELETE FROM member_request WHERE id = ?";
      db.query(query, [id], (err, results) => {
         if (err) {
            console.error(`Error deleting record from member_request:`, err);
            return res.status(500).json({ success: false, message: err })
         }
         return res.status(200).json({ success: true, message: 'Successful' })
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Get all members
const getAllMembers = async (req, res) => {
   try {
      const query = "SELECT * FROM users WHERE role = 'member'";
      db.query(query, (err, results) => {
         if (err) {
            console.error('Error fetching members:', err);
            return res.status(500).json({ success: false, message: err })
         }
         const formattedResults = results.map(member => ({
            ...member,
            deactivate: member.deactivate,
            deleted: member.deleted,
         }))
         return res.status(200).json({ success: true, data: formattedResults })
      });
   } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Check is request exist
const checkRequest = (req, res) =>{
   const { id } = req.params;
    try {
      if (isEmpty(id)) {
         return res.status(400).json({ success: false, message: 'User id is required' });
      }
      const sql = "SELECT COUNT(*) AS count FROM member_request WHERE userId = ?";
      db.query(sql, [id], (err, result) => {
          if (err) return res.status(500).json({success:false, message: "Database error" });
  
          if (result[0].count > 0) {
              return res.status(200).json({success:true, exists: true, message: "Request exists in the database." });
          } else {
              return res.status(500).status(404).json({success:true, exists: false, message: "Request not found." });
          }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Get a member request
const getRequest = (req, res) => {
   const Id = req.query.id;
   try {
       if (isEmpty(Id)) {
           return res.status(400).json({ success: false, message: 'Member request id is required' });
       }
       db.query('SELECT * FROM member_request WHERE userId = ?', [Id], (err, result) => {
           if (err) return res.status(500).json({ success: false, message: err.message });
           if (result.length === 0) return res.status(404).json({ success: false, message: 'Request not found' });
           return res.status(200).json({ success: true, data: result[0] });
       });
   } catch (error) {
       return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
}

// 📌 Deactivate a member
const deactivateMember = (req, res) => {
   const { id } = req.params;
   try {
       if (!id) return res.status(400).json({ error: "Event ID is required" });

       const sql = "UPDATE users SET deactivate = TRUE WHERE id = ?";
       db.query(sql, [id], (err, result) => {
           if (err) return res.status(500).json({ success: false, message: "Database error" });

           return res.status(200).json({ success: true, message: `Member has been successfully deactivated.` });
       });
   } catch (error) {
       return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
};

// 📌 Get non-deactivated members
const getNonDeactivatedMembers = (req, res) => {
   try {
       const sql = "SELECT * FROM users WHERE deactivate = FALSE";
       db.query(sql, (err, results) => {
           if (err) return res.status(500).json({ success: false, message: "Database error" });

           return res.status(200).json({ success: true, data: results });
       });
   } catch (error) {
       return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
};

// 📌 Restore deactivated member
const restoreDeactivatedMember = (req, res) => {
   const { id } = req.params;
   try {
       if (!id) return res.status(400).json({ error: "Event ID is required" });

       const sql = "UPDATE users SET deactivate = FALSE WHERE id = ?";
       db.query(sql, [id], (err, result) => {
           if (err) return res.status(500).json({ success: false, message: "Database error" });

           return res.status(200).json({ success: true, message: `Member restored successfully` });
       });
   } catch (error) {
       return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
   }
};


// 📌 Exporting all functions
module.exports = { memberRequest, getAllMembers, getAllMemberRequest, deletMemberRequest, checkRequest,getRequest,deactivateMember,getNonDeactivatedMembers,restoreDeactivatedMember };