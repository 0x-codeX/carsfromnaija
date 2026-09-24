import {
  useState,
  useEffect,
} from "react";
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
  Edit2,
  RotateCcw,
} from "lucide-react";
import API from "../../api/axios";

const MAX_IMAGES = 10;

const TOP_MAKES =
  [
    "Toyota",
    "Honda",
    "Nissan",
    "Hyundai",
    "Kia",
    "BMW",
    "Mercedes-Benz",
  ];

const ALPHABETICAL_MAKES =
  [
    "Acura",
    "Audi",
    "BYD",
    "Changan",
    "Chery",
    "Chevrolet",
    "Ford",
    "GAC",
    "Geely",
    "Jeep",
    "Land Rover",
    "Lexus",
    "Mazda",
    "Mitsubishi",
    "Porsche",
    "Tesla",
    "Volkswagen",
  ];

const ALL_PRESET_MAKES =
  [
    ...TOP_MAKES,
    ...ALPHABETICAL_MAKES,
  ];

const NIGERIAN_STATES =
  [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

const CAR_MODELS_MAP =
  {
    Toyota:
      [
        "Camry",
        "Corolla",
        "RAV4",
        "Highlander",
        "Avalon",
        "Matrix",
        "Prado",
        "Land Cruiser",
        "Hilux",
        "Sienna",
        "Venza",
        "Yaris",
        "Tacoma",
        "Tundra",
        "4Runner",
        "FJ Cruiser",
      ],
    Honda:
      [
        "Accord",
        "Civic",
        "CR-V",
        "Pilot",
        "Crosstour",
        "Odyssey",
        "Fit",
        "HR-V",
      ],
    Nissan:
      [
        "Altima",
        "Pathfinder",
        "Maxima",
        "Sentra",
        "Rogue",
        "Murano",
        "Patrol",
      ],
    Hyundai:
      [
        "Elantra",
        "Sonata",
        "Tucson",
        "Santa Fe",
        "Accent",
        "Genesis",
      ],
    Kia: [
      "Pegas",
      "Sorento",
      "Sportage",
      "Rio",
      "Optima",
      "Cerato",
      "Telluride",
      "Picanto",
    ],
    BMW: [
      "3 Series",
      "5 Series",
      "X3",
      "X5",
      "X6",
      "7 Series",
      "4 Series",
    ],
    "Mercedes-Benz":
      [
        "C-Class",
        "C 300",
        "E 350",
        "GLE-Class",
        "GLE-Class Coupe",
        "GLE 350",
        "GLE 450",
        "GLK 350",
        "GLC 300",
        "GLC 300 Coupe",
        "ML 350",
        "G 63 AMG",
        "G 63 AMG Coupe",
        "S-Class",
        "S 550",
        "CLA 250",
        "A 220",
      ],
    Acura:
      [
        "MDX",
        "RDX",
        "TLX",
        "TSX",
      ],
    Audi: [
      "A4",
      "A6",
      "Q5",
      "Q7",
      "Q3",
    ],
    BYD: [
      "Atto 3",
      "Dolphin",
      "Seal",
    ],
    Changan:
      [
        "CS35 Plus",
      ],
    Chery:
      [
        "Arrizo 5",
        "Tiggo 7 Pro",
        "Tiggo 8 Pro",
      ],
    Chevrolet:
      [
        "Cruze",
        "Equinox",
        "Malibu",
        "Tahoe",
        "Camaro",
      ],
    Ford: [
      "Explorer",
      "Escape",
      "F-150",
      "Edge",
      "Mustang",
      "Focus",
      "Fusion",
    ],
    GAC: [
      "GS4",
    ],
    Geely:
      [
        "Coolray",
      ],
    Jeep: [
      "Grand Cherokee",
      "Wrangler",
      "Cherokee",
      "Renegade",
    ],
    "Land Rover":
      [
        "Range Rover Sport",
        "Range Rover Vogue",
        "Range Rover Evoque",
        "Discovery",
        "Defender",
      ],
    Lexus:
      [
        "ES",
        "ES 350",
        "ES 300",
        "RX",
        "RX 350",
        "RX 330",
        "RX 300",
        "GX 460",
        "GX 470",
        "LX 570",
        "LX 600",
        "IS 250",
        "IS 350",
        "NX 200t",
        "NX 300",
      ],
    Mazda:
      [
        "CX-5",
        "CX-9",
        "Mazda 3",
        "Mazda 6",
      ],
    Mitsubishi:
      [
        "Pajero",
        "Outlander",
        "Lancer",
        "ASX",
      ],
    Porsche:
      [
        "Cayenne",
        "Macan",
        "Panamera",
        "911",
      ],
    Tesla:
      [
        "Model 3",
        "Model S",
        "Model X",
        "Model Y",
      ],
    Volkswagen:
      [
        "Golf",
        "Passat",
        "Jetta",
        "Tiguan",
        "Touareg",
      ],
  };

const YEARS =
  Array.from(
    {
      length:
        new Date().getFullYear() -
        1939,
    },
    (
      _,
      i,
    ) =>
      new Date().getFullYear() -
      i,
  );

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
        priceNGN:
          "",
        isNegotiable: true,
        category:
          "",
        condition:
          "Foreign Used",
        bodyType:
          "",
        location:
          "Lagos", // <-- Add this line
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
    isTitleCustomized,
    setIsTitleCustomized,
  ] =
    useState(
      false,
    );

  // Auto-populate Title strictly as: Year Make Model Condition
  useEffect(() => {
    if (
      !isTitleCustomized &&
      !isEditMode
    ) {
      const titleParts =
        [
          formData.year,
          formData.make,
          formData.model,
          formData.condition,
        ].filter(
          Boolean,
        );

      setFormData(
        (
          prev,
        ) => ({
          ...prev,
          title:
            titleParts.join(
              " ",
            ),
        }),
      );
    }
  }, [
    formData.make,
    formData.model,
    formData.year,
    formData.condition,
    isTitleCustomized,
    isEditMode,
  ]);

  const [
    makeOption,
    setMakeOption,
  ] =
    useState(
      () => {
        if (
          formData.make &&
          ALL_PRESET_MAKES.includes(
            formData.make,
          )
        ) {
          return formData.make;
        }
        if (
          formData.make
        ) {
          return "Other";
        }
        return "";
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
  const [
    existingImages,
    setExistingImages,
  ] =
    useState(
      [],
    );

  useEffect(() => {
    if (
      isEditMode
    ) {
      const fetchCar =
        async () => {
          try {
            const {
              data,
            } =
              await API.get(
                `/cars/${id}`,
              );
            setFormData(
              {
                title:
                  data.title ||
                  "",
                make:
                  data.make ||
                  "",
                model:
                  data.model ||
                  "",
                year:
                  data.year ||
                  new Date().getFullYear(),
                priceNGN:
                  data.priceNGN ||
                  "",
                isNegotiable:
                  data.isNegotiable ??
                  true,
                category:
                  data.category ||
                  "",
                condition:
                  data.condition ||
                  "Foreign Used",
                bodyType:
                  data.bodyType ||
                  "",
                location:
                  data.location ||
                  "Lagos",
                specs:
                  data.specs || {
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

            if (
              data.title
            )
              setIsTitleCustomized(
                true,
              );
            setMakeOption(
              ALL_PRESET_MAKES.includes(
                data.make,
              )
                ? data.make
                : data.make
                  ? "Other"
                  : "",
            );
            if (
              data.features
            )
              setFeatures(
                data.features,
              );

            if (
              data.images &&
              data
                .images
                .length >
                0
            ) {
              setExistingImages(
                data.images,
              );
              const mainIdx =
                data.images.findIndex(
                  (
                    img,
                  ) =>
                    img.url ===
                    data.mainImage,
                );
              setMainImageIndex(
                mainIdx !==
                  -1
                  ? mainIdx
                  : 0,
              );
            }

            if (
              data.video &&
              data
                .video
                .url
            )
              setVideoPreview(
                data
                  .video
                  .url,
              );
          } catch (error) {
            console.error(
              "Error fetching car:",
              error,
            );
            alert(
              "Failed to load vehicle details.",
            );
            navigate(
              "/admin/inventory",
            );
          }
        };
      fetchCar();
    }
  }, [
    id,
    isEditMode,
    navigate,
  ]);

  const handleAddFeature =
    (
      e,
    ) => {
      // Prevent form submission if triggered via a button click inside the form
      e.preventDefault();

      const cleanFeature =
        featureInput.trim();
      // Stress-test: Prevent empty inputs and duplicates
      if (
        cleanFeature &&
        !features.includes(
          cleanFeature,
        )
      ) {
        setFeatures(
          [
            ...features,
            cleanFeature,
          ],
        );
        setFeatureInput(
          "",
        );
      }
    };

  const removeFeature =
    (
      indexToRemove,
    ) => {
      setFeatures(
        features.filter(
          (
            _,
            index,
          ) =>
            index !==
            indexToRemove,
        ),
      );
    };

  const handleMakeSelectChange =
    (
      e,
    ) => {
      const selectedVal =
        e
          .target
          .value;
      setMakeOption(
        selectedVal,
      );

      if (
        selectedVal ===
        "Other"
      ) {
        setFormData(
          (
            prev,
          ) => ({
            ...prev,
            make: "",
            model:
              "",
          }),
        );
      } else {
        setFormData(
          (
            prev,
          ) => ({
            ...prev,
            make: selectedVal,
            model:
              "",
          }),
        );
      }
    };

  const handleImageChange =
    (
      e,
    ) => {
      const selectedFiles =
        Array.from(
          e
            .target
            .files ||
            [],
        );
      if (
        selectedFiles.length ===
        0
      )
        return;

      const currentTotal =
        existingImages.length +
        imageFiles.length;
      const remainingSlots =
        MAX_IMAGES -
        currentTotal;

      if (
        remainingSlots <=
        0
      ) {
        alert(
          `You can upload a maximum of ${MAX_IMAGES} images.`,
        );
        e.target.value =
          "";
        return;
      }

      const validFiles =
        selectedFiles.filter(
          (
            file,
          ) =>
            file.type.startsWith(
              "image/",
            ),
        );
      const filesToAdd =
        validFiles.slice(
          0,
          remainingSlots,
        );

      if (
        validFiles.length >
        remainingSlots
      ) {
        alert(
          `Only ${MAX_IMAGES} images are allowed. First ${remainingSlots} additional image(s) added.`,
        );
      }

      if (
        filesToAdd.length ===
        0
      ) {
        e.target.value =
          "";
        return;
      }

      setImageFiles(
        (
          prev,
        ) => [
          ...prev,
          ...filesToAdd,
        ],
      );
      setImagePreviews(
        (
          prev,
        ) => [
          ...prev,
          ...filesToAdd.map(
            (
              file,
            ) =>
              URL.createObjectURL(
                file,
              ),
          ),
        ],
      );
      e.target.value =
        "";
    };

  const removeImage =
    (
      index,
    ) => {
      const totalExisting =
        existingImages.length;

      if (
        index <
        totalExisting
      ) {
        // Removing a pre-existing image from the database
        setExistingImages(
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
      } else {
        // Removing a newly attached file
        const newFileIndex =
          index -
          totalExisting;
        setImagePreviews(
          (
            prev,
          ) => {
            if (
              prev[
                newFileIndex
              ]
            )
              URL.revokeObjectURL(
                prev[
                  newFileIndex
                ],
              );
            return prev.filter(
              (
                _,
                i,
              ) =>
                i !==
                newFileIndex,
            );
          },
        );
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
                newFileIndex,
            ),
        );
      }

      // Shift the main image index down dynamically so it doesn't break
      setMainImageIndex(
        (
          prev,
        ) => {
          if (
            index ===
            prev
          )
            return 0;
          if (
            index <
            prev
          )
            return (
              prev -
              1
            );
          return prev;
        },
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

      const submitData =
        new FormData();
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
      submitData.append(
        "condition",
        formData.condition,
      );
      submitData.append(
        "bodyType",
        formData.bodyType,
      );
      submitData.append(
        "location",
        formData.location,
      );
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
      submitData.append(
        "mainImageIndex",
        mainImageIndex,
      );
      submitData.append(
        "existingImages",
        JSON.stringify(
          existingImages,
        ),
      );

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
            "New vehicle uploaded to live inventory!",
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
          "Failed to save vehicle listing.",
        );
      } finally {
        setIsSubmitting(
          false,
        );
      }
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

  const availableModels =
    formData.make
      ? CAR_MODELS_MAP[
          formData
            .make
        ] ||
        []
      : [];
  const combinedImagePreviews =
    [
      ...existingImages.map(
        (
          img,
        ) =>
          img.url,
      ),
      ...imagePreviews,
    ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
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
              specifications
              and
              images
              to
              post
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Basic
            Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-slate-700">
                  Vehicle
                  Title
                </label>
                <div className="flex items-center gap-2">
                  {isTitleCustomized && (
                    <button
                      type="button"
                      onClick={() =>
                        setIsTitleCustomized(
                          false,
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      <RotateCcw
                        size={
                          12
                        }
                      />
                      Reset
                      Auto
                      Title
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setIsTitleCustomized(
                        true,
                      )
                    }
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded transition-colors ${
                      isTitleCustomized
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    <Edit2
                      size={
                        12
                      }
                    />
                    {isTitleCustomized
                      ? "Customized Title"
                      : "Edit Title"}
                  </button>
                </div>
              </div>
              <input
                type="text"
                placeholder="e.g. 2019 Toyota Corolla Registered"
                required
                value={
                  formData.title
                }
                onChange={(
                  e,
                ) => {
                  setIsTitleCustomized(
                    true,
                  );
                  setFormData(
                    {
                      ...formData,
                      title:
                        e
                          .target
                          .value,
                    },
                  );
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Make
              </label>
              <select
                required
                value={
                  makeOption
                }
                onChange={
                  handleMakeSelectChange
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="">
                  Select
                  Make...
                </option>
                {TOP_MAKES.map(
                  (
                    make,
                  ) => (
                    <option
                      key={
                        make
                      }
                      value={
                        make
                      }
                    >
                      {
                        make
                      }
                    </option>
                  ),
                )}
                <option
                  disabled
                  className="text-slate-400"
                >
                  ──────────────────
                </option>
                {ALPHABETICAL_MAKES.map(
                  (
                    make,
                  ) => (
                    <option
                      key={
                        make
                      }
                      value={
                        make
                      }
                    >
                      {
                        make
                      }
                    </option>
                  ),
                )}
                <option
                  disabled
                  className="text-slate-400"
                >
                  ──────────────────
                </option>
                <option value="Other">
                  Other
                  (Custom
                  Make)
                </option>
              </select>
            </div>

            {makeOption ===
            "Other" ? (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Custom
                    Make
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Peugeot, Bugatti"
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
                    Custom
                    Model
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 504, Chiron"
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
              </>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Model
                </label>
                <select
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
                  disabled={
                    !formData.make
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">
                    {formData.make
                      ? "Select Model..."
                      : "Select Make First"}
                  </option>
                  {availableModels.map(
                    (
                      model,
                    ) => (
                      <option
                        key={
                          model
                        }
                        value={
                          model
                        }
                      >
                        {
                          model
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Year
              </label>
              <select
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
              >
                {YEARS.map(
                  (
                    yr,
                  ) => (
                    <option
                      key={
                        yr
                      }
                      value={
                        yr
                      }
                    >
                      {
                        yr
                      }
                    </option>
                  ),
                )}
              </select>
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
            {/* Condition Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Condition
              </label>
              <select
                required
                value={
                  formData.condition
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      condition:
                        e
                          .target
                          .value,
                    },
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="Foreign Used">
                  Foreign
                  Used
                </option>
                <option value="Registered">
                  Registered
                </option>
                <option value="Brand New">
                  Brand
                  New
                </option>
              </select>
            </div>

            {/* Body Type Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Body
                Type
              </label>
              <select
                value={
                  formData.bodyType
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      bodyType:
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
                  Body
                  Type...
                </option>
                <option value="Sedan">
                  Sedan
                </option>
                <option value="SUV">
                  SUV
                </option>
                <option value="4 door Coupe">
                  4
                  door
                  Coupe
                </option>
                <option value="2 Door coupe">
                  2
                  Door
                  coupe
                </option>
                <option value="Crossover">
                  Crossover
                </option>
                <option value="Truck">
                  Truck
                </option>
                <option value="Pick Up">
                  Pick
                  Up
                </option>
              </select>
            </div>

            {/* Location Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Location
                (State)
              </label>
              <select
                required
                value={
                  formData.location
                }
                onChange={(
                  e,
                ) =>
                  setFormData(
                    {
                      ...formData,
                      location:
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
                  Location...
                </option>
                {NIGERIAN_STATES.map(
                  (
                    state,
                  ) => (
                    <option
                      key={
                        state
                      }
                      value={
                        state
                      }
                    >
                      {
                        state
                      }
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
            Pricing
          </h2>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Vehicle
              Price
              (₦
              NGN)
            </label>
            <input
              type="number"
              placeholder="e.g. 25000000"
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

          {/* Negotiable Checkbox */}
          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isNegotiable"
              checked={Boolean(
                formData.isNegotiable,
              )}
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
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="isNegotiable"
              className="text-sm font-semibold text-slate-700 cursor-pointer select-none"
            >
              Price
              is
              Negotiable
            </label>
          </div>

          {/* Vehicle Specifications Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Vehicle
              Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Mileage
                  (km
                  or
                  miles)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 45000"
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
                  Engine
                  Type
                </label>
                <select
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
                >
                  <option value="">
                    Select
                    Engine
                    Type...
                  </option>
                  <option value="Petrol">
                    Petrol
                  </option>
                  <option value="Diesel">
                    Diesel
                  </option>
                  <option value="Hybrid">
                    Hybrid
                  </option>
                  <option value="Electric">
                    Electric
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Transmission
                </label>
                <select
                  required
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
                  Color
                  (Optional)
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  VIN
                  (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1HGCR2F..."
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4.5: Key Features */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Key
              Features
            </h2>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Leather Seats, Panoramic Sunroof, Apple CarPlay"
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
                onKeyDown={(
                  e,
                ) => {
                  // Catch the Enter key so it adds the feature instead of submitting the form
                  if (
                    e.key ===
                    "Enter"
                  ) {
                    e.preventDefault();
                    handleAddFeature(
                      e,
                    );
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={
                  handleAddFeature
                }
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2"
              >
                <Plus
                  size={
                    16
                  }
                />{" "}
                Add
              </button>
            </div>

            {/* Display added features as removable tags */}
            {features.length >
              0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {features.map(
                  (
                    feature,
                    idx,
                  ) => (
                    <div
                      key={
                        idx
                      }
                      className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-100"
                    >
                      <span>
                        {
                          feature
                        }
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          removeFeature(
                            idx,
                          )
                        }
                        className="text-blue-400 hover:text-red-500 transition-colors bg-white rounded-full p-0.5 shadow-sm"
                        aria-label="Remove feature"
                      >
                        <X
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
              <p className="text-xs font-semibold text-blue-600 mt-1">
                Maximum{" "}
                {
                  MAX_IMAGES
                }{" "}
                images
                total
                •
                First
                image
                is
                the
                main
                image
                by
                default
              </p>
            </div>

            {/* Image Previews Grid */}
            {combinedImagePreviews.length >
              0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pt-4">
                {combinedImagePreviews.map(
                  (
                    src,
                    idx,
                  ) => (
                    <div
                      key={
                        idx
                      }
                      className="relative h-28 rounded-xl overflow-hidden border border-slate-200 group"
                    >
                      <img
                        src={
                          src
                        }
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMainImageIndex(
                            idx,
                          )
                        }
                        className={`absolute bottom-1 left-1 px-2 py-1 rounded-md text-[10px] font-bold ${
                          mainImageIndex ===
                          idx
                            ? "bg-blue-600 text-white"
                            : "bg-white/90 text-slate-700"
                        }`}
                      >
                        {mainImageIndex ===
                        idx
                          ? "Main Image"
                          : "Set as Main"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          removeImage(
                            idx,
                          )
                        }
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
          </div>

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
              ? "Uploading..."
              : isEditMode
                ? "Save Changes"
                : "Publish Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
