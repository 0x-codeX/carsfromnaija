import { useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import {
  Upload,
  X,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import API from "../../api/axios";

const DEFAULT_FX_RATE = 1550;

export default function AddEditCar() {
  const {
    id,
  } =
    useParams();
  const navigate =
    useNavigate();
  const isEditMode =
    Boolean(
      id,
    );

  const [
    formData,
    setFormData,
  ] =
    useState(
      {
        title:
          "",
        make: "",
        model:
          "",
        year: new Date().getFullYear(),
        priceUSD:
          "",
        priceNGN:
          "",
        isNegotiable: true,
        category:
          "", // NEW: Add category to state
        specs:
          {
            mileage:
              "",
            transmission:
              "Automatic",
            engineType:
              "",
            vin: "",
            color:
              "",
          },
      },
    );

  const [
    features,
    setFeatures,
  ] =
    useState(
      [
        "Reverse Camera",
        "Keyless Entry",
      ],
    );
  const [
    featureInput,
    setFeatureInput,
  ] =
    useState(
      "",
    );
  const [
    imageFiles,
    setImageFiles,
  ] =
    useState(
      [],
    );
  const [
    imagePreviews,
    setImagePreviews,
  ] =
    useState(
      [],
    );
  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(
      false,
    );
  const [
    videoFile,
    setVideoFile,
  ] =
    useState(
      null,
    );
  const [
    videoPreview,
    setVideoPreview,
  ] =
    useState(
      "",
    );
  const [
    mainImageIndex,
    setMainImageIndex,
  ] =
    useState(
      0,
    );

  // FX Rate calculation handler
  const handleUSDChange =
    (
      e,
    ) => {
      const usdVal =
        e
          .target
          .value;
      const ngnCalc =
        usdVal
          ? Number(
              usdVal,
            ) *
            DEFAULT_FX_RATE
          : "";
      setFormData(
        (
          prev,
        ) => ({
          ...prev,
          priceUSD:
            usdVal,
          priceNGN:
            ngnCalc,
        }),
      );
    };

  const handleImageChange =
    (
      e,
    ) => {
      const files =
        Array.from(
          e
            .target
            .files,
        );
      if (
        files.length ===
        0
      )
        return;

      // 1. Hard constraint: 10 Images Max Total
      const totalAfterUpload =
        imageFiles.length +
        files.length;
      if (
        totalAfterUpload >
        10
      ) {
        alert(
          `Limit exceeded! You can only upload a maximum of 10 images. You currently have ${imageFiles.length} and tried to add ${files.length}.`,
        );
        return;
      }

      // 2. Hard constraint: 5MB per image limit to prevent Multer size crashes
      const oversizedFiles =
        files.filter(
          (
            file,
          ) =>
            file.size >
            5 *
              1024 *
              1024,
        );
      if (
        oversizedFiles.length >
        0
      ) {
        alert(
          "One or more images exceed the 5MB size limit.",
        );
        return;
      }

      setImageFiles(
        (
          prev,
        ) => [
          ...prev,
          ...files,
        ],
      );

      const newPreviews =
        files.map(
          (
            file,
          ) =>
            URL.createObjectURL(
              file,
            ),
        );
      setImagePreviews(
        (
          prev,
        ) => [
          ...prev,
          ...newPreviews,
        ],
      );
    };

  const removeImage =
    (
      index,
    ) => {
      setImageFiles(
        (
          prev,
        ) =>
          prev.filter(
            (
              _,
              i,
            ) =>
              i !==
              index,
          ),
      );
      setImagePreviews(
        (
          prev,
        ) =>
          prev.filter(
            (
              _,
              i,
            ) =>
              i !==
              index,
          ),
      );
    };

  // Handle Key Features Array
  const addFeature =
    () => {
      if (
        featureInput.trim() &&
        !features.includes(
          featureInput.trim(),
        )
      ) {
        setFeatures(
          (
            prev,
          ) => [
            ...prev,
            featureInput.trim(),
          ],
        );
        setFeatureInput(
          "",
        );
      }
    };

  const removeFeature =
    (
      index,
    ) => {
      setFeatures(
        (
          prev,
        ) =>
          prev.filter(
            (
              _,
              i,
            ) =>
              i !==
              index,
          ),
      );
    };

  const handleVideoChange =
    (
      e,
    ) => {
      const file =
        e
          .target
          .files[0];
      if (
        !file
      )
        return;

      // Hard constraint: Reject files over 15MB to protect server RAM and bandwidth
      if (
        file.size >
        15 *
          1024 *
          1024
      ) {
        alert(
          "Video is too large. Please compress it to under 15MB.",
        );
        return;
      }

      setVideoFile(
        file,
      );
      setVideoPreview(
        URL.createObjectURL(
          file,
        ),
      );
    };

  const handleSubmit =
    async (
      e,
    ) => {
      e.preventDefault();
      setIsSubmitting(
        true,
      );

      // FormData instantiated correctly inside the function scope
      const submitData =
        new FormData();

      // 1. Append Text Data
      submitData.append(
        "title",
        formData.title,
      );
      submitData.append(
        "make",
        formData.make,
      );
      submitData.append(
        "model",
        formData.model,
      );
      submitData.append(
        "year",
        formData.year,
      );
      submitData.append(
        "priceUSD",
        formData.priceUSD,
      );
      submitData.append(
        "priceNGN",
        formData.priceNGN,
      );
      submitData.append(
        "isNegotiable",
        formData.isNegotiable,
      );
      submitData.append(
        "category",
        formData.category,
      );

      // 2. Append Stringified Objects/Arrays
      submitData.append(
        "specs",
        JSON.stringify(
          formData.specs,
        ),
      );
      submitData.append(
        "features",
        JSON.stringify(
          features,
        ),
      );

      // 3. Append the Main Image Index
      submitData.append(
        "mainImageIndex",
        mainImageIndex,
      );

      // 4. Append actual selected binary image files
      imageFiles.forEach(
        (
          file,
        ) => {
          submitData.append(
            "images",
            file,
          );
        },
      );

      // 5. Append Video File (if it exists)
      if (
        videoFile
      ) {
        submitData.append(
          "video",
          videoFile,
        );
      }

      try {
        if (
          isEditMode
        ) {
          await API.put(
            `/cars/${id}`,
            formData,
          );
          alert(
            "Vehicle listing updated successfully!",
          );
        } else {
          await API.post(
            "/cars",
            submitData,
            {
              headers:
                {
                  "Content-Type":
                    "multipart/form-data",
                },
            },
          );
          alert(
            "New vehicle uploaded to live inventory and saved to Cloudinary!",
          );
        }
        navigate(
          "/admin/inventory",
        );
      } catch (error) {
        console.error(
          "Error saving vehicle:",
          error,
        );
        alert(
          "Failed to save vehicle listing. Check terminal logs.",
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
    };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/inventory"
            className="p-2 bg-white rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft
              size={
                20
              }
            />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {isEditMode
                ? "Edit Vehicle Listing"
                : "Add New Vehicle"}
            </h1>
            <p className="text-slate-500 text-sm">
              Fill
              in
              the
              specifications
              and
              images
              to
              post
              to
              the
              public
              catalog.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-8"
      >
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Basic
            Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Vehicle
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. 2021 Mercedes-Benz GLE 450 AMG"
                required
                value={
                  formData.title
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      title:
                        e
                          .target
                          .value,
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Make
              </label>
              <input
                type="text"
                placeholder="e.g. Mercedes-Benz"
                required
                value={
                  formData.make
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      make: e
                        .target
                        .value,
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Model
              </label>
              <input
                type="text"
                placeholder="e.g. GLE 450"
                required
                value={
                  formData.model
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      model:
                        e
                          .target
                          .value,
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Year
              </label>
              <input
                type="number"
                required
                value={
                  formData.year
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      year: Number(
                        e
                          .target
                          .value,
                      ),
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Category
                (Optional)
              </label>
              <select
                value={
                  formData.category
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      category:
                        e
                          .target
                          .value,
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">
                  Select
                  Class...
                </option>
                <option value="Regular">
                  Regular
                </option>
                <option value="Hybrid">
                  Hybrid
                </option>
                <option value="Electric">
                  Electric
                </option>
                <option value="Luxury">
                  Luxury
                </option>
                <option value="Exotic">
                  Exotic
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & FX Valuation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pricing
            &
            FX
            Valuation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Base
                Buy
                Price
                ($
                USD)
              </label>
              <input
                type="number"
                placeholder="e.g. 25000"
                required
                value={
                  formData.priceUSD
                }
                onChange={
                  handleUSDChange
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Calculated
                Price
                (₦
                NGN)
              </label>
              <input
                type="number"
                placeholder="Auto-calculated from USD"
                required
                value={
                  formData.priceNGN
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      priceNGN:
                        e
                          .target
                          .value,
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-bold text-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isNegotiable"
              checked={
                formData.isNegotiable
              }
              onChange={(
                e,
              ) =>
                setFormData(
                  {
                    ...formData,
                    isNegotiable:
                      e
                        .target
                        .checked,
                  },
                )
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isNegotiable"
              className="text-sm font-semibold text-slate-700 cursor-pointer"
            >
              Mark
              Price
              as
              Negotiable
              on
              Public
              Site
            </label>
          </div>
        </div>

        {/* Section 3: Technical Specifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Technical
            Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Mileage
                (Miles)
              </label>
              <input
                type="number"
                placeholder="e.g. 24000"
                required
                value={
                  formData
                    .specs
                    .mileage
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      specs:
                        {
                          ...formData.specs,
                          mileage:
                            e
                              .target
                              .value,
                        },
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Transmission
              </label>
              <select
                value={
                  formData
                    .specs
                    .transmission
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      specs:
                        {
                          ...formData.specs,
                          transmission:
                            e
                              .target
                              .value,
                        },
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Automatic">
                  Automatic
                </option>
                <option value="Manual">
                  Manual
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Engine
                Type
              </label>
              <input
                type="text"
                placeholder="e.g. 3.0L Turbo V6"
                required
                value={
                  formData
                    .specs
                    .engineType
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      specs:
                        {
                          ...formData.specs,
                          engineType:
                            e
                              .target
                              .value,
                        },
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                VIN
                (Optional)
              </label>
              <input
                type="text"
                placeholder="17-Digit Vehicle ID"
                value={
                  formData
                    .specs
                    .vin
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      specs:
                        {
                          ...formData.specs,
                          vin: e
                            .target
                            .value,
                        },
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Exterior
                Color
              </label>
              <input
                type="text"
                placeholder="e.g. Midnight Black"
                value={
                  formData
                    .specs
                    .color
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      specs:
                        {
                          ...formData.specs,
                          color:
                            e
                              .target
                              .value,
                        },
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Key Features */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Key
            Features
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Panoramic Sunroof"
              value={
                featureInput
              }
              onChange={(
                e,
              ) =>
                setFeatureInput(
                  e
                    .target
                    .value,
                )
              }
              className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={
                addFeature
              }
              className="bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-slate-800 transition-colors"
            >
              <Plus
                size={
                  16
                }
              />{" "}
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {features.map(
              (
                feature,
                idx,
              ) => (
                <span
                  key={
                    idx
                  }
                  className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2"
                >
                  <CheckCircle2
                    size={
                      14
                    }
                    className="text-emerald-500"
                  />
                  {
                    feature
                  }
                  <button
                    type="button"
                    onClick={() =>
                      removeFeature(
                        idx,
                      )
                    }
                    className="text-slate-400 hover:text-red-500"
                  >
                    <X
                      size={
                        14
                      }
                    />
                  </button>
                </span>
              ),
            )}
          </div>
        </div>

        {/* Section 5: Image Upload */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Vehicle
            Images
          </h2>

          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={
                handleImageChange
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload
              size={
                32
              }
              className="mx-auto text-slate-400 mb-2"
            />
            <p className="text-sm font-bold text-slate-700">
              Click
              or
              Drag
              &
              Drop
              Images
              Here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports
              PNG,
              JPG,
              or
              WEBP
              (Max
              5MB
              per
              file)
            </p>
          </div>

          {/* Image Previews Grid with Main Image Selector */}
          {imagePreviews.length >
            0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-4">
              {imagePreviews.map(
                (
                  src,
                  idx,
                ) => (
                  <div
                    key={
                      idx
                    }
                    onClick={() =>
                      setMainImageIndex(
                        idx,
                      )
                    }
                    className={`relative h-28 rounded-xl overflow-hidden border-4 cursor-pointer transition-all ${
                      mainImageIndex ===
                      idx
                        ? "border-blue-600 shadow-md"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={
                        src
                      }
                      alt="preview"
                      className="w-full h-full object-cover"
                    />

                    {mainImageIndex ===
                      idx && (
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] text-center font-bold py-1">
                        MAIN
                        IMAGE
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(
                        e,
                      ) => {
                        e.stopPropagation();
                        removeImage(
                          idx,
                        );
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity"
                    >
                      <Trash2
                        size={
                          14
                        }
                      />
                    </button>
                  </div>
                ),
              )}
            </div>
          )}

          {/* Video Upload Section */}
          <div className="mt-6 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={
                handleVideoChange
              }
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload
              size={
                32
              }
              className="mx-auto text-slate-400 mb-2"
            />
            <p className="text-sm font-bold text-slate-700">
              Upload
              Walkaround
              Video
              (Max
              45s)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports
              MP4,
              WebM
              (Max
              15MB)
            </p>
          </div>
          {videoPreview && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200">
              <video
                src={
                  videoPreview
                }
                controls
                className="w-full h-48 object-cover bg-black"
              />
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to="/admin/inventory"
            className="px-6 py-3 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={
              isSubmitting
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-md"
          >
            {isSubmitting
              ? "Uploading to Cloudinary..."
              : isEditMode
                ? "Save Changes"
                : "Publish Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
