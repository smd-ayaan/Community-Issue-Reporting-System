const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG, JPG, PNG and WebP immages are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limitd: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload; 