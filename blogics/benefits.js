const db = require("../db/db");
const StringStore = require("../constants/constants");
const { isEmpty } = require('./commons');

// 📌 Create a benefit
const createBenefit = (req, res) => {
    const { user_id, benefit } = req.body;
    try {
        if (isEmpty(user_id) || isEmpty(benefit)) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const query = `INSERT INTO benefits (user_id, benefit) VALUES (?, ?)`;
        db.query(query, [user_id, benefit], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            return res.status(201).json({ success: true, message: 'Benefit created successfully', moduleId: result.insertId });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}


// 📌 Get a benefit
const getBenefit = (req, res) => {
    const { id } = req.params;
    try {
        if (isEmpty(id)) {
            return res.status(400).json({ success: false, message: 'Benefit id is required' });
        }
        db.query('SELECT * FROM benefits WHERE id = ?', [id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.length === 0) return res.status(404).json({ success: false, message: 'Benefit not found' });
            return res.status(200).json({ success: true, data: result[0] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Get all benefits
const getAllBenefits = (req, res) => {
    try {
        db.query('SELECT * FROM benefits', (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            return res.status(200).json({ success: true, data: results });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}


// 📌 Exporting all functions
module.exports = { createBenefit, getBenefit, getAllBenefits };