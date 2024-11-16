const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors());

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
    },
});

// Initialize multer
const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 50 * 1024 * 1024 } // Limit file size to 50 MB
}).array('files');

// Serve static files in the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Endpoint to handle file uploads
app.post('/upload', upload, (req, res) => {
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
        console.log('No files uploaded');
        return res.status(400).json({ message: 'No files uploaded.' });
    }

    console.log('Files uploaded successfully:', req.files);

    // Map the file details to send back to the frontend
    const fileDetails = req.files.map(file => ({
        originalName: file.originalname,
        filePath: `/uploads/${file.filename}`,
    }));

    // Respond with the file details
    res.status(200).json({
        message: 'Files uploaded successfully!',
        files: fileDetails,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
