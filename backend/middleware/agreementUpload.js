import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = 'uploads/agreements';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `agreement-${uniqueSuffix}-${sanitizedBaseName}${extension}`);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed. Received: ${file.mimetype}`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 10 // Maximum 10 files per upload
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer errors
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          error: 'File too large',
          message: 'File size must be less than 10MB'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          error: 'Too many files',
          message: 'Maximum 10 files allowed per upload'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          error: 'Unexpected field',
          message: 'Unexpected file field in upload'
        });
      default:
        return res.status(400).json({
          error: 'Upload error',
          message: error.message
        });
    }
  } else if (error) {
    return res.status(400).json({
      error: 'File validation error',
      message: error.message
    });
  }
  next();
};

// Utility function to delete uploaded files
export const deleteUploadedFiles = (files) => {
  if (!files || !Array.isArray(files)) return;
  
  files.forEach(file => {
    const filePath = file.path || path.join(uploadsDir, file.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }
  });
};

// Utility function to delete a single file by path
export const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
      return false;
    }
  }
  return false;
};

// Utility function to validate file exists
export const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Utility function to get file stats
export const getFileStats = (filePath) => {
  try {
    return fs.statSync(filePath);
  } catch (error) {
    return null;
  }
};

// Main upload middleware - supports multiple files
export const uploadAgreementDocuments = upload.array('documents', 10);

// Single file upload middleware
export const uploadSingleDocument = upload.single('document');

// Middleware to process uploaded files and add metadata
export const processUploadedFiles = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    req.uploadedDocuments = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date()
    }));
  } else if (req.file) {
    req.uploadedDocuments = [{
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date()
    }];
  } else {
    req.uploadedDocuments = [];
  }
  next();
};

// Middleware to clean up files on error
export const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  
  res.send = function(data) {
    if (res.statusCode >= 400 && req.files) {
      deleteUploadedFiles(req.files);
    }
    return originalSend.call(this, data);
  };
  
  res.json = function(data) {
    if (res.statusCode >= 400 && req.files) {
      deleteUploadedFiles(req.files);
    }
    return originalJson.call(this, data);
  };
  
  next();
};

export default {
  uploadAgreementDocuments,
  uploadSingleDocument,
  processUploadedFiles,
  handleUploadError,
  cleanupOnError,
  deleteUploadedFiles,
  deleteFile,
  fileExists,
  getFileStats
};