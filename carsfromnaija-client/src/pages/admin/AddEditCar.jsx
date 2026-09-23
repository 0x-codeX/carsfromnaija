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
        priceUSD:
          "",
        priceNGN:
          "",
        isNegotiable: true,
        category:
          "",
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

  const availableModels =
    formData.make
      ? CAR_MODELS_MAP[
          formData
            .make
        ] ||
        []
      : [];

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
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Vehicle
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. 2026 Tesla Model 3 Long Range"
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
          </div>
        </div>

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
