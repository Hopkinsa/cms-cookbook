/**
 * Multer Configuration Module
 * Configures file upload handling and storage settings using multer.
 * Files are temporarily stored in the public/temp directory before being processed.
 */

import multer from 'multer';

// Define allowed file types (MIME types and extensions)
const ALLOWED_TYPES = ['application/zip'];
const ALLOWED_EXT = /\.(zip)$/i; // Case-insensitive check

/**
 * Configure multer disk storage
 * Specifies destination directory and filename generation for uploaded files
 */
const storage = multer.memoryStorage();

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
  // Validate MIME type
  const mimeTypeValid = ALLOWED_TYPES.includes(file.mimetype);
  // Validate file extension
  const extValid = ALLOWED_EXT.test((file.originalname.substring(file.originalname.lastIndexOf('.'))).toLowerCase());

  if (mimeTypeValid && extValid) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file with a specific error message
    cb(new Error('Invalid file type. Only ZIP files are allowed.'));
  }
};

/**
 * Initialize multer with configured storage and filters
 * @example
 * // In routes file:
 * router.post('/images/upload', upload.single('file'), uploadImageFileControler);
 */
const uploadZip = multer({ storage, fileFilter });

export default uploadZip;
