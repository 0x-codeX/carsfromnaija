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

const upload =
  multer({
    storage:
      multer.memoryStorage(),
    limits:
      {
        fileSize:
          15 *
          1024 *
          1024, // 15MB strict hard limit
      },
  });

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
              resource_type:
                "auto", 
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
