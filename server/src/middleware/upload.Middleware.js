import crypto from "crypto";
import fs from "fs";
import fsPromises from "fs/promises";
import multer from "multer";
import { getUploadDir, removeFiles } from "../utils/fileStorage.js";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
export const MAX_IMAGES_PER_REQUEST = 3;

const allowedImages = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const signatures = {
  "image/jpeg": (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  "image/png": (bytes) =>
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47,
  "image/webp": (bytes) =>
    bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP",
};

const createImageUpload = (folder) => {
  const directory = getUploadDir(folder);
  fs.mkdirSync(directory, { recursive: true });

  return multer({
    storage: multer.diskStorage({
      destination: directory,
      filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${crypto.randomUUID()}${allowedImages[file.mimetype]}`);
      },
    }),
    limits: {
      fileSize: MAX_IMAGE_SIZE,
      files: MAX_IMAGES_PER_REQUEST,
    },
    fileFilter: (req, file, callback) => {
      if (!allowedImages[file.mimetype]) {
        const error = new Error("Only JPG, PNG and WEBP images are allowed.");
        error.status = 400;
        return callback(error);
      }

      return callback(null, true);
    },
  });
};

const readFileHeader = async (filePath) => {
  const handle = await fsPromises.open(filePath, "r");

  try {
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, 12, 0);
    return buffer;
  } finally {
    await handle.close();
  }
};

export const removeUploadsIfFailed = (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      removeFiles(req.files ?? []);
    }
  });

  next();
};

export const verifyImageContent = async (req, res, next) => {
  try {
    for (const file of req.files ?? []) {
      const header = await readFileHeader(file.path);

      if (!signatures[file.mimetype](header)) {
        return res.status(400).json({
          message: `${file.originalname} is not a valid image file.`,
        });
      }
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export const requestImagesUpload = createImageUpload("requests").array(
  "images",
  MAX_IMAGES_PER_REQUEST,
);
