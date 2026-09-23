const Car = require("../models/Car");
const {
  cloudinary,
  uploadToCloudinary,
} = require("../config/cloudinary");

// Enforce strict inventory limits to stay on free tiers
const MAX_INVENTORY_SIZE = 20;


// @desc    Get all cars
// @route   GET /api/cars
exports.getCars =
  async (
    req,
    res,
  ) => {
    try {
      const cars =
        await Car.find().sort(
          {
            createdAt:
              -1,
          },
        );
      res
        .status(
          200,
        )
        .json(
          cars,
        );
    } catch (error) {
      console.error(
        "Error fetching cars:",
        error,
      );
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Server error while fetching inventory.",
          },
        );
    }
  };

// @desc    Get single car by ID
// @route   GET /api/cars/:id
exports.getCarById =
  async (
    req,
    res,
  ) => {
    try {
      const car =
        await Car.findById(
          req
            .params
            .id,
        );
      if (
        !car
      ) {
        return res
          .status(
            404,
          )
          .json(
            {
              message:
                "Vehicle not found.",
            },
          );
      }
      res
        .status(
          200,
        )
        .json(
          car,
        );
    } catch (error) {
      console.error(
        "Error fetching car:",
        error,
      );
      res
        .status(
          500,
        )
        .json(
          {
            message:
              "Server error while fetching vehicle details.",
          },
        );
    }
  };

// @desc    Create a new car with Auto-Pruning
// @route   POST /api/cars
exports.createCar =
  async (
    req,
    res,
  ) => {
    try {
      const currentCount =
        await Car.countDocuments();

      // 1. Auto-Pruning Engine (Concurrent image deletion)
      if (
        currentCount >=
        MAX_INVENTORY_SIZE
      ) {
        const oldestCar =
          await Car.findOne().sort(
            {
              createdAt: 1,
            },
          );
        if (
          oldestCar
        ) {
          if (
            oldestCar.images &&
            oldestCar
              .images
              .length >
              0
          ) {
            const prunePromises =
              oldestCar.images
                .filter(
                  (
                    img,
                  ) =>
                    img.public_id,
                )
                .map(
                  (
                    img,
                  ) =>
                    cloudinary.uploader.destroy(
                      img.public_id,
                    ),
                );
            await Promise.all(
              prunePromises,
            );
          }
          await Car.findByIdAndDelete(
            oldestCar._id,
          );
          console.log(
            `⚠️ Auto-pruned oldest listing: ${oldestCar.title}`,
          );
        }
      }

      let imageResults =
        [];
      let videoResult =
        null;

      // Process Images
      if (
        req.files &&
        req
          .files
          .images &&
        req
          .files
          .images
          .length >
          0
      ) {
        const uploadPromises =
          req.files.images.map(
            (
              file,
            ) =>
              uploadToCloudinary(
                file.buffer,
              ),
          );
        const uploadedFiles =
          await Promise.all(
            uploadPromises,
          );
        imageResults =
          uploadedFiles.map(
            (
              result,
            ) => ({
              url: result.secure_url,
              public_id:
                result.public_id,
            }),
          );
      }

      // Process Video
      if (
        req.files &&
        req
          .files
          .video &&
        req
          .files
          .video
          .length >
          0
      ) {
        const vidUpload =
          await uploadToCloudinary(
            req
              .files
              .video[0]
              .buffer,
          );
        videoResult =
          {
            url: vidUpload.secure_url,
            public_id:
              vidUpload.public_id,
          };
      }

      // Determine the Main Representing Image
      const mainIndex =
        req
          .body
          .mainImageIndex
          ? parseInt(
              req
                .body
                .mainImageIndex,
            )
          : 0;
      const mainImageUrl =
        imageResults.length >
          0 &&
        imageResults[
          mainIndex
        ]
          ? imageResults[
              mainIndex
            ]
              .url
          : "/logo.png";

      const carData =
        {
          ...req.body,
          specs:
            typeof req
              .body
              .specs ===
            "string"
              ? JSON.parse(
                  req
                    .body
                    .specs,
                )
              : req
                  .body
                  .specs,
          features:
            typeof req
              .body
              .features ===
            "string"
              ? JSON.parse(
                  req
                    .body
                    .features,
                )
              : req
                  .body
                  .features,
          images:
            imageResults,
          mainImage:
            mainImageUrl,
          video:
            videoResult,
        };

      const newCar =
        await Car.create(
          carData,
        );
      res
        .status(
          201,
        )
        .json(
          newCar,
        );
    } catch (error) {
      console.error(
        "Error creating car:",
        error,
      );
      res
        .status(
          400,
        )
        .json(
          {
            message:
              "Invalid data submitted.",
            error:
              error.message,
          },
        );
    }
  };

// @desc    Update a car (handles text edits, new image uploads, and removing deleted images)
// @route   PUT /api/cars/:id
exports.updateCar =
  async (
    req,
    res,
  ) => {
    try {
      const car =
        await Car.findById(
          req
            .params
            .id,
        );
      if (
        !car
      ) {
        return res
          .status(
            404,
          )
          .json(
            {
              message:
                "Vehicle not found.",
            },
          );
      }

      // 1. Parse retained existing images sent from frontend
      let keptImages =
        [];
      if (
        req
          .body
          .existingImages
      ) {
        const parsed =
          typeof req
            .body
            .existingImages ===
          "string"
            ? JSON.parse(
                req
                  .body
                  .existingImages,
              )
            : req
                .body
                .existingImages;
        keptImages =
          Array.isArray(
            parsed,
          )
            ? parsed
            : [
                parsed,
              ];
      }

      // 2. Diff check: Destroy images on Cloudinary that were removed during edit
      const keptPublicIds =
        new Set(
          keptImages.map(
            (
              img,
            ) =>
              img.public_id,
          ),
        );
      const imagesToDestroy =
        car.images.filter(
          (
            img,
          ) =>
            img.public_id &&
            !keptPublicIds.has(
              img.public_id,
            ),
        );

      if (
        imagesToDestroy.length >
        0
      ) {
        const destroyPromises =
          imagesToDestroy.map(
            (
              img,
            ) =>
              cloudinary.uploader.destroy(
                img.public_id,
              ),
          );
        await Promise.all(
          destroyPromises,
        );
      }

      // 3. Upload new incoming file attachments concurrently
      let newImageResults =
        [];
      if (
        req.files &&
        req
          .files
          .length >
          0
      ) {
        const uploadPromises =
          req.files.map(
            (
              file,
            ) =>
              uploadToCloudinary(
                file.buffer,
              ),
          );
        const uploadedFiles =
          await Promise.all(
            uploadPromises,
          );
        newImageResults =
          uploadedFiles.map(
            (
              result,
            ) => ({
              url: result.secure_url,
              public_id:
                result.public_id,
            }),
          );
      }

      // 4. Merge retained existing images with newly uploaded ones
      const finalImages =
        [
          ...keptImages,
          ...newImageResults,
        ];

      // 5. Construct update payload
      const updateData =
        {
          ...req.body,
          specs:
            typeof req
              .body
              .specs ===
            "string"
              ? JSON.parse(
                  req
                    .body
                    .specs,
                )
              : req
                  .body
                  .specs,
          features:
            typeof req
              .body
              .features ===
            "string"
              ? JSON.parse(
                  req
                    .body
                    .features,
                )
              : req
                  .body
                  .features,
          images:
            finalImages,
        };

      delete updateData.existingImages;

      const mainIndex =
        req
          .body
          .mainImageIndex
          ? parseInt(
              req
                .body
                .mainImageIndex,
            )
          : 0;
      const mainImageUrl =
        finalImages.length >
          0 &&
        finalImages[
          mainIndex
        ]
          ? finalImages[
              mainIndex
            ]
              .url ||
            finalImages[
              mainIndex
            ]
          : "/logo.png";

      updateData.mainImage =
        mainImageUrl;

      const updatedCar =
        await Car.findByIdAndUpdate(
          req
            .params
            .id,
          updateData,
          {
            new: true,
            runValidators: true,
          },
        );

      res
        .status(
          200,
        )
        .json(
          updatedCar,
        );
    } catch (error) {
      console.error(
        "Error updating car:",
        error,
      );
      res
        .status(
          400,
        )
        .json(
          {
            message:
              "Failed to update vehicle.",
            error:
              error.message,
          },
        );
    }
  };

// @desc    Delete a car and its images concurrently
// @route   DELETE /api/cars/:id
// Replace your existing deleteCar function in carController_2.js with this:
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: "Vehicle not found." });
    }

    const keepMainImage = req.query.keepMainImage === "true";
    const mainImageUrl = car.mainImage;

    // 1. Destroy gallery images on Cloudinary, optionally skipping the main image
    if (car.images && car.images.length > 0) {
      const imagesToDestroy = car.images.filter((image) => {
        if (!image.public_id) return false;
        if (keepMainImage && image.url === mainImageUrl) return false; 
        return true;
      });

      const destroyPromises = imagesToDestroy.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      );
      await Promise.all(destroyPromises);
    }

    // 2. Destroy the video (You completely missed this in your original delete route)
    if (car.video && car.video.public_id) {
      await cloudinary.uploader.destroy(car.video.public_id);
    }

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Vehicle removed. Cloudinary pruned securely." });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Server error while deleting vehicle." });
  }
};
