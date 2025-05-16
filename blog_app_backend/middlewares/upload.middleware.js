const multer = require('multer');
const path = require('path'); 

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname).slice(1); // 🔄 More reliable
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
    }
});

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false); // Reject file
    }
};

// Configure multer with limits
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limit: 5MB
    }
});

module.exports = upload;
