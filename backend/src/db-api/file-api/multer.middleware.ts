/**
 * Multer Configuration Module
 * Configures file upload handling and storage settings using multer.
 * Files are temporarily stored in the public/temp directory before being processed.
 */

import multer from 'multer';
import * as path from 'path';

// Define destination file path for upload
const UPLOAD_PATH = path.resolve('../backend/images/uploaded');

// Define allowed file types (MIME types and extensions)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif']
const ALLOWED_EXT = /\.(jpg|jpeg|png|gif)$/i // Case-insensitive check

/**
 * Configure multer disk storage
 * Specifies destination directory and filename generation for uploaded files
 */
const storage = multer.diskStorage({
  /**
   * Set destination directory for uploaded files
   * @param req - Express request object
   * @param file - File object from multer
   * @param cb - Callback to handle destination
   */
  destination: function (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, UPLOAD_PATH);
  },
  /**
   * NOT IN USE!
   * Generate unique filename for uploaded file
   * Combines timestamp and random number to ensure uniqueness
   * @param req - Express request object
   * @param file - File object from multer
   * @param cb - Callback to handle filename
   */
  filename: function (
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
    cb(null, file.originalname);
  },
});

const fileFilter = (req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  // Validate MIME type
  const mimeTypeValid = ALLOWED_TYPES.includes(file.mimetype)
  // Validate file extension
  const extValid = ALLOWED_EXT.test(path.extname(file.originalname).toLowerCase())

  if (mimeTypeValid && extValid) {
    // Accept the file
    cb(null, true)
  } else {
    // Reject the file with a specific error message
    cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'))
  }
}

/**
 * Initialize multer with configured storage and filters
 * @example
 * // In routes file:
 * router.post('/images/upload', upload.single('file'), uploadImageFileControler);
 */
const upload = multer({ storage, fileFilter });

export default upload;