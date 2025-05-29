import multer from 'multer';
import path from 'path';
import fs from 'fs';

const createUploadsDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'uploads/';
    if (file.fieldname === 'avatar') {
      folder += 'avatars/';
    } else {
      folder += 'verification/';
    }
    createUploadsDir(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);

    if (file.fieldname === 'avatar') {
      cb(null, `avatar-${userId}${ext}`);
    } else {
      cb(null, `doc-${userId}-${timestamp}${ext}`);
    }
  }
});

const avatarFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Аватар должен быть в формате JPEG или PNG'), false);
  }
};

const documentFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Документы должны быть в формате PDF'), false);
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter: avatarFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('avatar');

export const uploadDocuments = multer({
  storage,
  fileFilter: documentFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5 // Макс. 5 файлов
  }
}).array('documents');