import {
  useState,
  useEffect,
} from "react";
import {
  Save,
  Calculator,
  Phone,
  List,
  Plus,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";
import API from "../../api/axios";

// Standard Nigerian market popular imports mapping
const CAR_DATA =
  {
    Toyota:
      [
        "Camry",
        "Corolla",
        "Highlander",
        "RAV4",
        "Sienna",
        "Tacoma",
        "Tundra",
        "4Runner",
        "Avalon",
        "Yaris",
        "Venza",
        "Land Cruiser",
      ],
    Honda:
      [
        "Accord",
        "Civic",
        "CR-V",
        "Pilot",
        "Odyssey",
        "HR-V",
        "Ridgeline",
        "Fit",
      ],
    Lexus:
      [
        "RX 350",
        "ES 350",
        "IS 250",
        "GX 460",
        "LX 570",
        "NX 200t",
        "GS 350",
      ],
    "Mercedes-Benz":
      [
        "C-Class",
        "E-Class",
        "S-Class",
        "GLE",
        "GLC",
        "GLA",
        "G-Class",
        "ML-Class",
        "GLK",
      ],
    BMW: [
      "3 Series",
      "5 Series",
      "X3",
      "X5",
      "X6",
      "7 Series",
    ],
    Ford: [
      "F-150",
      "Mustang",
      "Explorer",
      "Escape",
      "Edge",
    ],
    Chevrolet:
      [
        "Silverado",
        "Malibu",
        "Equinox",
        "Tahoe",
        "Suburban",
        "Camaro",
      ],
    Nissan:
      [
        "Altima",
        "Sentra",
        "Rogue",
        "Pathfinder",
        "Maxima",
        "Murano",
      ],
    Hyundai:
      [
        "Elantra",
        "Sonata",
        "Tucson",
        "Santa Fe",
        "Palisade",
      ],
    Kia: [
      "Optima",
      "Sorento",
      "Sportage",
      "Telluride",
      "Forte",
      "Rio",
    ],
    Land_Rover:
      [
        "Range Rover",
        "Range Rover Sport",
        "Range Rover Evoque",
        "Discovery",
      ],
    Other:
      [
        "Other",
      ],
  };

const MAKES =
  Object.keys(
    CAR_DATA,
  );
const currentYear =
  new Date().getFullYear() +
  1;
const YEARS =
  Array.from(
    {
      length: 30,
    },
    (
      _,
      i,
    ) =>
      currentYear -
      i,
  );

export default function Settings() {
  const [
    settings,
    setSettings,
  ] =
    useState(
      {
        exchangeRateUSDToNGN: 1550,
        standardShippingUSD: 2500,
        standardClearingNGN: 3500000,
        dealerPhoneWhatsApp:
          "+234 805 997 5887",
        dealerEmail:
          "sales@carsfromnaija.com",
        priceGuides:
          [],
      },
    );
  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );
  const [
    saving,
    setSaving,
  ] =
    useState(
      false,
    );
  const [
    uploadingState,
    setUploadingState,
  ] =
    useState(
      {
        index:
          null,
        view: null,
      },
    );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings =
    async () => {
      try {
        const response =
          await API.get(
            "/settings",
          );
        if (
          response.data
        ) {
          const formattedGuides =
            (
              response
                .data
                .priceGuides ||
              []
            ).map(
              (
                guide,
              ) => ({
                ...guide,
                images:
                  guide.images || {
                    front:
                      "",
                    back: "",
                    interior:
                      "",
                  },
              }),
            );
          setSettings(
            {
              ...response.data,
              priceGuides:
                formattedGuides,
            },
          );
        }
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error,
        );
        alert(
          "Error fetching platform settings.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  const handleChange =
    (
      e,
    ) => {
      const {
        name,
        value,
      } =
        e.target;
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          [name]:
            value,
        }),
      );
    };

  const handleAddGuide =
    () => {
      if (
        settings
          .priceGuides
          .length >=
        20
      ) {
        return alert(
          "Maximum limit of 20 price guides reached.",
        );
      }
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          priceGuides:
            [
              ...prev.priceGuides,
              {
                make: "Toyota",
                model:
                  "Camry",
                yearStart: 2010,
                yearEnd: 2015,
                priceMinNGN: 0,
                priceMaxNGN: 0,
                images:
                  {
                    front:
                      "",
                    back: "",
                    interior:
                      "",
                  },
                category:
                  "Regular",
              },
            ],
        }),
      );
    };

  const handleUpdateGuide =
    (
      index,
      field,
      value,
    ) => {
      const updatedGuides =
        [
          ...settings.priceGuides,
        ];
      const numericFields =
        [
          "yearStart",
          "yearEnd",
          "priceMinNGN",
          "priceMaxNGN",
        ];

      updatedGuides[
        index
      ][
        field
      ] =
        numericFields.includes(
          field,
        )
          ? value ===
            ""
            ? ""
            : Number(
                value,
              )
          : value;

      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          priceGuides:
            updatedGuides,
        }),
      );
    };

  const handleUpdateImage =
    (
      index,
      view,
      value,
    ) => {
      const updatedGuides =
        [
          ...settings.priceGuides,
        ];
      if (
        !updatedGuides[
          index
        ]
          .images
      ) {
        updatedGuides[
          index
        ].images =
          {
            front:
              "",
            back: "",
            interior:
              "",
          };
      }
      updatedGuides[
        index
      ].images[
        view
      ] =
        value;
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          priceGuides:
            updatedGuides,
        }),
      );
    };

  const handleRemoveGuide =
    (
      index,
    ) => {
      const updatedGuides =
        settings.priceGuides.filter(
          (
            _,
            i,
          ) =>
            i !==
            index,
        );
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          priceGuides:
            updatedGuides,
        }),
      );
    };

  const handleImageUpload =
    async (
      index,
      view,
      file,
    ) => {
      if (
        !file
      )
        return;

      setUploadingState(
        {
          index,
          view,
        },
      );
      const formData =
        new FormData();
      formData.append(
        "image",
        file,
      );

      try {
        const res =
          await API.post(
            "/upload",
            formData,
            {
              headers:
                {
                  "Content-Type":
                    "multipart/form-data",
                },
            },
          );

        handleUpdateImage(
          index,
          view,
          res
            .data
            .url,
        );
      } catch (error) {
        console.error(
          "Upload failed:",
          error,
        );
        alert(
          "Failed to upload image. Please try again or paste a URL directly.",
        );
      } finally {
        setUploadingState(
          {
            index:
              null,
            view: null,
          },
        );
      }
    };

  const handleSubmit =
    async (
      e,
    ) => {
      e.preventDefault();
      setSaving(
        true,
      );

      const hasInvalidPrices =
        settings.priceGuides.some(
          (
            guide,
          ) =>
            guide.priceMaxNGN >
              0 &&
            guide.priceMaxNGN <
              guide.priceMinNGN,
        );

      if (
        hasInvalidPrices
      ) {
        return alert(
          "Submission blocked: One or more Market Price Guides have a maximum price lower than the minimum price. Please fix the errors before saving.",
        );
      }

      setSaving(
        true,
      );

      // Format numeric values before payload dispatch
      const payload =
        {
          ...settings,
          priceGuides:
            settings.priceGuides.map(
              (
                guide,
              ) => ({
                ...guide,
                priceMinNGN:
                  Number(
                    guide.priceMinNGN,
                  ) ||
                  0,
                priceMaxNGN:
                  Number(
                    guide.priceMaxNGN,
                  ) ||
                  0,
                yearStart:
                  Number(
                    guide.yearStart,
                  ) ||
                  2010,
                yearEnd:
                  Number(
                    guide.yearEnd,
                  ) ||
                  2015,
              }),
            ),
        };

      try {
        await API.put(
          "/settings",
          payload,
        );
        alert(
          "Global configuration and Price Guides updated successfully!",
        );
      } catch (error) {
        console.error(
          "Failed to save settings:",
          error,
        );
        alert(
          "Failed to save settings.",
        );
      } finally {
        setSaving(
          false,
        );
      }
    };

  if (
    loading
  ) {
    return (
      <div className="p-8 text-center text-slate-500 font-bold">
        Loading
        configurations...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Platform
          Settings
        </h1>
        <p className="text-slate-500">
          Control
          exchange
          rates,
          costs,
          contact
          details,
          and
          search
          fallback
          guides.
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        {/* Cost Calculator Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Calculator
              size={
                20
              }
              className="text-blue-600"
            />
            <h2 className="text-lg font-bold">
              Pricing
              Engine
              (Cost
              Calculator)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                USD
                to
                NGN
                Exchange
                Rate
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₦
                </span>
                <input
                  type="number"
                  name="exchangeRateUSDToNGN"
                  required
                  value={
                    settings.exchangeRateUSDToNGN
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Standard
                Shipping
                Cost
                (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  name="standardShippingUSD"
                  required
                  value={
                    settings.standardShippingUSD
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Standard
                Clearing
                &
                Duty
                (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₦
                </span>
                <input
                  type="number"
                  name="standardClearingNGN"
                  required
                  value={
                    settings.standardClearingNGN
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Phone
              size={
                20
              }
              className="text-emerald-600"
            />
            <h2 className="text-lg font-bold">
              Contact
              &
              Lead
              Generation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                WhatsApp
                Number
                (Intl
                Format)
              </label>
              <input
                type="text"
                name="dealerPhoneWhatsApp"
                required
                value={
                  settings.dealerPhoneWhatsApp
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Dealer
                Email
              </label>
              <input
                type="email"
                name="dealerEmail"
                required
                value={
                  settings.dealerEmail
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Market Price Guides Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900">
              <List
                size={
                  20
                }
                className="text-purple-600"
              />
              <h2 className="text-lg font-bold">
                Market
                Price
                Guides
              </h2>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {
                settings
                  .priceGuides
                  .length
              }{" "}
              /
              20
              Active
            </span>
          </div>

          <div className="space-y-6">
            {settings.priceGuides.map(
              (
                guide,
                index,
              ) => {
                const availableModels =
                  CAR_DATA[
                    guide
                      .make
                  ] ||
                  [];

                // Determine if the Make is custom or explicitly set to 'Other'
                const isOtherMake =
                  guide.make ===
                    "Other" ||
                  guide.make ===
                    "" ||
                  !Object.keys(
                    CAR_DATA,
                  ).includes(
                    guide.make,
                  );

                return (
                  <div
                    key={
                      index
                    }
                    className="grid grid-cols-12 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl relative shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveGuide(
                          index,
                        )
                      }
                      className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-1.5 rounded-full transition-colors shadow-sm"
                    >
                      <Trash2
                        size={
                          16
                        }
                      />
                    </button>

                    <div className="col-span-12 md:col-span-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Make
                        &
                        Model
                      </label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <select
                            required
                            value={
                              isOtherMake
                                ? "Other"
                                : guide.make
                            }
                            onChange={(
                              e,
                            ) => {
                              const val =
                                e
                                  .target
                                  .value;
                              if (
                                val ===
                                "Other"
                              ) {
                                // User wants to type a custom make
                                handleUpdateGuide(
                                  index,
                                  "make",
                                  "",
                                );
                                handleUpdateGuide(
                                  index,
                                  "model",
                                  "",
                                );
                              } else {
                                // User selected a known make, assign it and default its first model
                                handleUpdateGuide(
                                  index,
                                  "make",
                                  val,
                                );
                                const models =
                                  CAR_DATA[
                                    val
                                  ] ||
                                  [];
                                handleUpdateGuide(
                                  index,
                                  "model",
                                  models[0] ||
                                    "",
                                );
                              }
                            }}
                            className={`bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 ${isOtherMake ? "w-full" : "w-1/2"}`}
                          >
                            <option
                              value=""
                              disabled
                            >
                              Select
                              Make
                            </option>
                            {MAKES.map(
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
                                  {make.replace(
                                    "_",
                                    " ",
                                  )}
                                </option>
                              ),
                            )}
                          </select>

                          {!isOtherMake && (
                            <select
                              required
                              value={
                                guide.model
                              }
                              onChange={(
                                e,
                              ) =>
                                handleUpdateGuide(
                                  index,
                                  "model",
                                  e
                                    .target
                                    .value,
                                )
                              }
                              className="w-1/2 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                            >
                              <option
                                value=""
                                disabled
                              >
                                Select
                                Model
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
                          )}
                        </div>

                        {/* Display text inputs if 'Other' is selected */}
                        {isOtherMake && (
                          <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                            <input
                              type="text"
                              placeholder="Enter Make"
                              required
                              value={
                                guide.make ===
                                "Other"
                                  ? ""
                                  : guide.make
                              }
                              onChange={(
                                e,
                              ) =>
                                handleUpdateGuide(
                                  index,
                                  "make",
                                  e
                                    .target
                                    .value,
                                )
                              }
                              className="w-1/2 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Enter Model"
                              required
                              value={
                                guide.model ===
                                "Other"
                                  ? ""
                                  : guide.model
                              }
                              onChange={(
                                e,
                              ) =>
                                handleUpdateGuide(
                                  index,
                                  "model",
                                  e
                                    .target
                                    .value,
                                )
                              }
                              className="w-1/2 bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Year
                        Range
                      </label>
                      <div className="flex items-center gap-1 h-8">
                        <select
                          required
                          value={
                            guide.yearStart
                          }
                          onChange={(
                            e,
                          ) =>
                            handleUpdateGuide(
                              index,
                              "yearStart",
                              Number(
                                e
                                  .target
                                  .value,
                              ),
                            )
                          }
                          className="w-full bg-white border border-slate-300 rounded-md px-1 py-1 text-sm focus:outline-none focus:border-blue-500 text-center h-full"
                        >
                          {YEARS.map(
                            (
                              year,
                            ) => (
                              <option
                                key={
                                  year
                                }
                                value={
                                  year
                                }
                              >
                                {
                                  year
                                }
                              </option>
                            ),
                          )}
                        </select>
                        <span className="text-slate-400">
                          -
                        </span>
                        <select
                          required
                          value={
                            guide.yearEnd
                          }
                          onChange={(
                            e,
                          ) =>
                            handleUpdateGuide(
                              index,
                              "yearEnd",
                              Number(
                                e
                                  .target
                                  .value,
                              ),
                            )
                          }
                          className="w-full bg-white border border-slate-300 rounded-md px-1 py-1 text-sm focus:outline-none focus:border-blue-500 text-center h-full"
                        >
                          {YEARS.map(
                            (
                              year,
                            ) => (
                              <option
                                key={
                                  year
                                }
                                value={
                                  year
                                }
                              >
                                {
                                  year
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Price
                        Range
                        (NGN)
                      </label>
                      <div className="flex items-center gap-2 h-8">
                        <input
                          type="number"
                          placeholder="Min"
                          required
                          value={
                            guide.priceMinNGN
                          }
                          onChange={(
                            e,
                          ) =>
                            handleUpdateGuide(
                              index,
                              "priceMinNGN",
                              Number(
                                e
                                  .target
                                  .value,
                              ),
                            )
                          }
                          className="w-full bg-white border border-slate-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-blue-500 h-full"
                        />
                        <span className="text-slate-400">
                          to
                        </span>
                        <input
                          type="number"
                          placeholder="Max"
                          required
                          value={
                            guide.priceMaxNGN
                          }
                          onChange={(
                            e,
                          ) =>
                            handleUpdateGuide(
                              index,
                              "priceMaxNGN",
                              Number(
                                e
                                  .target
                                  .value,
                              ),
                            )
                          }
                          className={`w-full bg-white border rounded-md px-3 py-1 text-sm focus:outline-none h-full ${
                            guide.priceMaxNGN >
                              0 &&
                            guide.priceMaxNGN <
                              guide.priceMinNGN
                              ? "border-red-500 focus:border-red-500 bg-red-50"
                              : "border-slate-300 focus:border-blue-500"
                          }`}
                        />
                      </div>
                      {/* Real-time Validation Warning */}
                      {guide.priceMaxNGN >
                        0 &&
                        guide.priceMaxNGN <
                          guide.priceMinNGN && (
                          <p className="text-red-500 text-[11px] mt-1.5 font-bold animate-in fade-in slide-in-from-top-1">
                            Max
                            price
                            cannot
                            be
                            less
                            than
                            min
                            price.
                          </p>
                        )}
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={
                          guide.category
                        }
                        onChange={(
                          e,
                        ) =>
                          handleUpdateGuide(
                            index,
                            "category",
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-full h-8 bg-white border border-slate-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
                      >
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

                    {/* 3 Images File Upload / URL Input */}
                    <div className="col-span-12 mt-2 pt-4 border-t border-slate-200">
                      <label className="block text-xs font-semibold text-slate-700 mb-3">
                        Vehicle
                        Images
                        (Required
                        for
                        Guide)
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            key: "front",
                            label:
                              "Front view",
                          },
                          {
                            key: "back",
                            label:
                              "backview",
                          },
                          {
                            key: "interior",
                            label:
                              "interior",
                          },
                        ].map(
                          (
                            view,
                          ) => {
                            const imageUrl =
                              guide
                                .images?.[
                                view
                                  .key
                              ] ||
                              "";
                            const isUploading =
                              uploadingState.index ===
                                index &&
                              uploadingState.view ===
                                view.key;

                            return (
                              <div
                                key={
                                  view.key
                                }
                                className="space-y-2"
                              >
                                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                                  <ImageIcon
                                    size={
                                      12
                                    }
                                  />{" "}
                                  {
                                    view.label
                                  }
                                </label>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="url"
                                      placeholder="https://..."
                                      value={
                                        imageUrl
                                      }
                                      onChange={(
                                        e,
                                      ) =>
                                        handleUpdateImage(
                                          index,
                                          view.key,
                                          e
                                            .target
                                            .value,
                                        )
                                      }
                                      className="flex-grow bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                    <label
                                      className={`cursor-pointer px-2 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center justify-center ${
                                        isUploading
                                          ? "bg-slate-300 text-slate-500"
                                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                      }`}
                                    >
                                      <UploadCloud
                                        size={
                                          14
                                        }
                                      />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={
                                          isUploading
                                        }
                                        onChange={(
                                          e,
                                        ) =>
                                          handleImageUpload(
                                            index,
                                            view.key,
                                            e
                                              .target
                                              .files[0],
                                          )
                                        }
                                      />
                                    </label>
                                  </div>
                                  <div className="w-full h-24 bg-slate-200 rounded-md border border-slate-300 overflow-hidden flex items-center justify-center">
                                    {imageUrl ? (
                                      <img
                                        src={
                                          imageUrl
                                        }
                                        alt={
                                          view.label
                                        }
                                        className="w-full h-full object-cover"
                                        onError={(
                                          e,
                                        ) =>
                                          (e.target.src =
                                            "https://via.placeholder.com/150?text=Invalid+URL")
                                        }
                                      />
                                    ) : (
                                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                        No
                                        Image
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </div>
                );
              },
            )}

            {settings
              .priceGuides
              .length <
              20 && (
              <button
                type="button"
                onClick={
                  handleAddGuide
                }
                className="w-full py-4 border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus
                  size={
                    18
                  }
                />{" "}
                Add
                New
                Price
                Guide
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              saving ||
              uploadingState.index !==
                null
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-md disabled:bg-blue-300"
          >
            <Save
              size={
                20
              }
            />
            {saving
              ? "Saving to Database..."
              : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
