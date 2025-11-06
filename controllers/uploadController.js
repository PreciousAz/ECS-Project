const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const StringStore = require("../constants/constants");

const storage = multer.diskStorage({
    destination: './uploads/', // Folder where images will be stored
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb('Error: Only images (JPG, PNG, GIF) are allowed!');
        }
    }
});

 // 📌 Upload image endpoint
router.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload an image' });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.json({ success: true, message: 'Image uploaded successfully', filePath: `/uploads/${req.file.filename}`, url: imageUrl });
});

 // 📌 Get image endpoint
router.get('/api/get-image/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    return res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ success: false, message: 'Image not found' });
        }
    });
});

 // 📌 Get all images endpoint
router.get('/api/list-images', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading directory' });
        }
        return res.status(200).json({ success: true, images: files });
    });
});

 // 📌 Exporting this router
module.exports = router;