import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const UPLOADS_ROOT = path.resolve(currentDir, "../../uploads");

export const getUploadDir = (folder) => {
  return path.join(UPLOADS_ROOT, folder);
};

export const toPublicUrl = (folder, filename) => {
  return `/uploads/${folder}/${filename}`;
};

export const toStoragePath = (fileUrl) => {
  const relative = fileUrl.replace(/^\/uploads\//, "");
  const resolved = path.resolve(UPLOADS_ROOT, relative);

  if (!resolved.startsWith(UPLOADS_ROOT)) {
    return null;
  }

  return resolved;
};

export const removeFile = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("FILE DELETE ERROR:", error.message);
    }
  }
};

export const removeFiles = async (files = []) => {
  await Promise.all(files.map((file) => removeFile(file.path)));
};
