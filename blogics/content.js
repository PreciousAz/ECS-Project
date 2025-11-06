const db = require("../db/db");
const StringStore = require("../constants/constants");
const { isEmpty } = require('./commons');

// 📌 Create a module
const createContent = (req, res) => {
    const { module_name, module_image, module_interest } = req.body;
    try {
        if (isEmpty(module_name) || isEmpty(module_image) || isEmpty(module_interest)) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const query = `INSERT INTO contents (module_name, module_image, module_interest) VALUES (?, ?, ?)`;
        db.query(query, [module_name, module_image, module_interest], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            return res.status(201).json({ success: true, message: 'Module created successfully', moduleId: result.insertId });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Update module
const updateContent = (req, res) => {
    const moduleId = req.params.id;
    const { module_name, module_image, module_interest } = req.body;
    try {
        if (isEmpty(module_name) || isEmpty(module_image) || isEmpty(module_interest)) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const query = `UPDATE contents SET module_name = ?, module_image = ?, module_interest = ? WHERE id = ?`;
        db.query(query, [module_name, module_image, module_interest, moduleId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Module not found' });
            return res.status(200).json({ success: true, message: 'Module updated successfully' });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Delete module
const deleteContent = (req, res) => {
    const moduleId = req.params.id;
    try {
        if (isEmpty(moduleId)) {
            return res.status(400).json({ success: false, message: 'Module id is required' });
        }
        db.query('DELETE FROM contents WHERE id = ?', [moduleId], (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Module not found' });
            return res.status(200).json({ success: true, message: 'Module deleted successfully' });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Get a module
const getContent = (req, res) => {
    const moduleId = req.params.id;
    try {
        if (isEmpty(moduleId)) {
            return res.status(400).json({ success: false, message: 'Module id is required' });
        }
        db.query('SELECT * FROM contents WHERE id = ?', [moduleId], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (result.length === 0) return res.status(404).json({ success: false, message: 'Module not found' });
            return res.status(200).json({ success: true, data: result[0] });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}

// 📌 Get all modules
const getAllContents = (req, res) => {
    try {
        db.query('SELECT * FROM culture.contents', (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
           return res.status(200).json({success:true, data:results});
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: StringStore.SERVER_ERROR, error });
    }
}


// 📌 Exporting all functions
module.exports = { createContent, updateContent, getContent, getAllContents, deleteContent };