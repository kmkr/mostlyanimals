import fs from "fs";
import { id } from "./id-generator.js";

export default function writeTempFile(file) {
  const temp = "/tmp";
  const tempFile = `${temp}/${id()}_${file.originalname}`;
  return new Promise((resolve, reject) => {
    console.log("[temp-file-writer] Writing %s", tempFile);
    fs.writeFile(tempFile, file.buffer, (err) => {
      if (err) {
        return reject(err);
      }

      return resolve({
        path: tempFile,
      });
    });
  });
}
