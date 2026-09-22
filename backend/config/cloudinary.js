const cloudinary =
  require("cloudinary").v2;
const multer = require("multer");

cloudinary.config(
  {
    cloud_name:
      process
        .env
        .CLOUDINARY_CLOUD_NAME,
    api_key:
      process
        .env
        .CLOUDINARY_API_KEY,
    api_secret:
      process
        .env
        .CLOUDINARY_API_SECRET,
  },
);

// Store file in memory temporarily before streaming to Cloudinary
const storage =
  multer.memoryStorage();
const upload =
  multer({
    storage,
    limits:
      {
        fileSize:
          5 *
          1024 *
          1024,
      }, // 5MB limit per image
  });

// Helper function to upload buffers to Cloudinary
const uploadToCloudinary =
  (
    fileBuffer,
  ) => {
    return new Promise(
      (
        resolve,
        reject,
      ) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder:
                "carsfromnaija_inventory",
            },
            (
              error,
              result,
            ) => {
              if (
                error
              )
                return reject(
                  error,
                );
              resolve(
                result,
              );
            },
          );
        uploadStream.end(
          fileBuffer,
        );
      },
    );
  };

module.exports =
  {
    cloudinary,
    upload,
    uploadToCloudinary,
  };
