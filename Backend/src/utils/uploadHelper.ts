import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

export const uploadToCloudinary = (
  buffer: Buffer
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "green-planet/products",
      },
      (error, result) => {
        console.log("Cloudinary Error:", error);
        console.log("Cloudinary Result:", result);

        if (error) {
          return reject(error);
        }

        resolve(result?.secure_url || "");
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};