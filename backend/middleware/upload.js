const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const documentsDir = path.join(uploadDir, 'documents');
const photosDir = path.join(uploadDir, 'photos');

[uploadDir, documentsDir, photosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'passportPhoto') {
            cb(null, photosDir);
        } else {
            cb(null, documentsDir);
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedMimes = {
        'birthCertificate': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        'kcpeResults': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        'passportPhoto': ['image/jpeg', 'image/jpg', 'image/png']
    };

    const allowedTypes = allowedMimes[file.fieldname] || [];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}. Allowed: ${allowedTypes.join(', ')}`), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    },
    fileFilter: fileFilter
});

// Upload middleware for admission documents
exports.uploadAdmissionDocuments = upload.fields([
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'kcpeResults', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 }
]);

// Single file upload
exports.uploadSingle = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
    }
});

