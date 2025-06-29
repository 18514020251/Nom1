const multer = require('multer');
const path = require('path');
const fs = require('fs');


const avatarDir = path.join(__dirname, '../public/avatars');
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

// 配置 Multer 存储引擎
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`); 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/gif', 
        'image/webp'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('只支持 JPG, PNG, GIF 和 WebP 格式的图片'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 2 * 1024 * 1024 
    },
    fileFilter: fileFilter
});

module.exports = upload;