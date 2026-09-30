import {
  useState,
  useEffect,
} from "react";
import CarCard from "../components/CarCard";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
        "Range Rover Defender",
        "Discovery",
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

const CONDITIONS =
  [
    "Foreign Used",
    "Registered",
    "Brand New",
  ];
const CATEGORIES =
  [
    "Regular",
    "Hybrid",
    "Electric",
    "Luxury",
    "Exotic",
  ];
const BODY_TYPES =
  [
    "Sedan",
    "SUV",
    "4 door Coupe",
    "2 Door coupe",
    "Crossover",
    "Truck",
    "Pick Up",
  ];
const TRANSMISSIONS =
  [
    "Automatic",
    "Manual",
  ];

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

export default function Inventory() {
  const [
    cars,
    setCars,
  ] =
    useState(
      [],
    );
  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );
  const [
    error,
    setError,
  ] =
    useState(
      null,
    );

  // Advanced Filter Toggle State
  const [
    showAdvancedFilters,
    setShowAdvancedFilters,
  ] =
    useState(
      false,
    );

  // Filter States
  const [
    selectedMake,
    setSelectedMake,
  ] =
    useState(
      "",
    );
  const [
    customMake,
    setCustomMake,
  ] =
    useState(
      "",
    );
  const [
    selectedModel,
    setSelectedModel,
  ] =
    useState(
      "",
    );
  const [
    customModel,
    setCustomModel,
  ] =
    useState(
      "",
    );
  const [
    selectedYear,
    setSelectedYear,
  ] =
    useState(
      "",
    );
  const [
    maxPrice,
    setMaxPrice,
  ] =
    useState(
      "",
    );

  const [
    selectedCondition,
    setSelectedCondition,
  ] =
    useState(
      "",
    );
  const [
    selectedCategory,
    setSelectedCategory,
  ] =
    useState(
      "",
    );
  const [
    selectedBodyType,
    setSelectedBodyType,
  ] =
    useState(
      "",
    );
  const [
    selectedTransmission,
    setSelectedTransmission,
  ] =
    useState(
      "",
    );
  const [
    selectedLocation,
    setSelectedLocation,
  ] =
    useState(
      "",
    );

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars =
    async () => {
      try {
        setLoading(
          true,
        );
        setError(
          null,
        );
        const response =
          await API.get(
            "/cars",
          );
        setCars(
          response.data ||
            [],
        );
      } catch (err) {
        console.error(
          "Failed to fetch live inventory:",
          err,
        );
        setError(
          "Unable to connect to inventory service. Please try again later.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  const handleMakeChange =
    (
      e,
    ) => {
      setSelectedMake(
        e
          .target
          .value,
      );
      setCustomMake(
        "",
      );
      setSelectedModel(
        "",
      );
      setCustomModel(
        "",
      );
    };

  const handleResetFilters =
    () => {
      setSelectedMake(
        "",
      );
      setCustomMake(
        "",
      );
      setSelectedModel(
        "",
      );
      setCustomModel(
        "",
      );
      setSelectedYear(
        "",
      );
      setMaxPrice(
        "",
      );
      setSelectedCondition(
        "",
      );
      setSelectedCategory(
        "",
      );
      setSelectedBodyType(
        "",
      );
      setSelectedTransmission(
        "",
      );
      setSelectedLocation(
        "",
      );
    };

  const parseMaxPrice =
    (
      val,
    ) => {
      if (
        !val
      )
        return null;
      const clean =
        val
          .toString()
          .trim()
          .toLowerCase()
          .replace(
            /,/g,
            "",
          );
      if (
        /^\d+(\.\d+)?m$/.test(
          clean,
        )
      )
        return (
          parseFloat(
            clean,
          ) *
          1000000
        );
      if (
        /^\d+(\.\d+)?k$/.test(
          clean,
        )
      )
        return (
          parseFloat(
            clean,
          ) *
          1000
        );
      const num =
        Number(
          clean,
        );
      if (
        !isNaN(
          num,
        ) &&
        num >
          0
      ) {
        if (
          num <=
          200
        )
          return (
            num *
            1000000
          );
        return num;
      }
      return null;
    };

  const parsedMaxPrice =
    parseMaxPrice(
      maxPrice,
    );

  const filteredCars =
    cars.filter(
      (
        car,
      ) => {
        if (
          car.status &&
          car.status !==
            "available"
        )
          return false;

        if (
          selectedMake
        ) {
          if (
            selectedMake ===
            "Other"
          ) {
            if (
              customMake
            ) {
              const targetMake =
                customMake.toLowerCase();
              const carMake =
                car.make?.toLowerCase() ||
                "";
              const carTitle =
                car.title?.toLowerCase() ||
                "";
              if (
                !carMake.includes(
                  targetMake,
                ) &&
                !carTitle.includes(
                  targetMake,
                )
              )
                return false;
            }
          } else {
            const targetMake =
              selectedMake.toLowerCase();
            const carMake =
              car.make?.toLowerCase() ||
              "";
            const carTitle =
              car.title?.toLowerCase() ||
              "";
            if (
              carMake !==
                targetMake &&
              !carTitle.includes(
                targetMake,
              )
            )
              return false;
          }
        }

        if (
          selectedMake ===
            "Other" &&
          customModel
        ) {
          const targetModel =
            customModel.toLowerCase();
          const carModel =
            car.model?.toLowerCase() ||
            "";
          const carTitle =
            car.title?.toLowerCase() ||
            "";
          if (
            !carModel.includes(
              targetModel,
            ) &&
            !carTitle.includes(
              targetModel,
            )
          )
            return false;
        } else if (
          selectedModel
        ) {
          const targetModel =
            selectedModel.toLowerCase();
          const carModel =
            car.model?.toLowerCase() ||
            "";
          const carTitle =
            car.title?.toLowerCase() ||
            "";
          if (
            carModel !==
              targetModel &&
            !carTitle.includes(
              targetModel,
            )
          )
            return false;
        }

        if (
          selectedYear &&
          Number(
            car.year,
          ) !==
            Number(
              selectedYear,
            )
        )
          return false;
        if (
          parsedMaxPrice !==
            null &&
          Number(
            car.priceNGN,
          ) >
            parsedMaxPrice
        )
          return false;

        if (
          selectedCondition &&
          car.condition !==
            selectedCondition
        )
          return false;
        if (
          selectedCategory &&
          car.category !==
            selectedCategory
        )
          return false;
        if (
          selectedBodyType &&
          car.bodyType !==
            selectedBodyType
        )
          return false;
        if (
          selectedLocation &&
          car.location !==
            selectedLocation
        )
          return false;
        if (
          selectedTransmission &&
          car
            .specs
            ?.transmission !==
            selectedTransmission
        )
          return false;

        return true;
      },
    );

  const availableModels =
    selectedMake
      ? CAR_MODELS_MAP[
          selectedMake
        ] ||
        []
      : [];

  const hasActiveFilters =
    Boolean(
      selectedMake ||
      customMake ||
      selectedModel ||
      customModel ||
      selectedYear ||
      maxPrice ||
      selectedCondition ||
      selectedCategory ||
      selectedBodyType ||
      selectedTransmission ||
      selectedLocation,
    );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="sticky top-[80px] z-40 mb-8 py-1 px-1 bg-white/80 backdrop-blur-lg border border-slate-200 shadow-sm rounded-xl w-max">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 font-bold text-sm hover:text-purple-700 bg-transparent rounded-lg transition-colors"
        >
          <ArrowLeft
            size={
              18
            }
          />{" "}
          Back
          to
          Home
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:sticky md:top-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Search
                Filters
              </h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    handleResetFilters
                  }
                  className="text-xs font-semibold text-purple-600 hover:underline"
                >
                  Reset
                  All
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Group 1: Core Search */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Basic
                  Info
                </h4>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Make
                  </label>
                  <select
                    value={
                      selectedMake
                    }
                    onChange={
                      handleMakeChange
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">
                      All
                      Makes
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
                      /
                      Custom
                    </option>
                  </select>
                </div>

                {selectedMake ===
                "Other" ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Custom
                        Make
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Peugeot"
                        value={
                          customMake
                        }
                        onChange={(
                          e,
                        ) =>
                          setCustomMake(
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Custom
                        Model
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 504"
                        value={
                          customModel
                        }
                        onChange={(
                          e,
                        ) =>
                          setCustomModel(
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Model
                    </label>
                    <select
                      value={
                        selectedModel
                      }
                      onChange={(
                        e,
                      ) =>
                        setSelectedModel(
                          e
                            .target
                            .value,
                        )
                      }
                      disabled={
                        !selectedMake
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      <option value="">
                        {selectedMake
                          ? "All Models"
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

                {/* YEAR MOVED TO BASIC INFO */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Year
                  </label>
                  <select
                    value={
                      selectedYear
                    }
                    onChange={(
                      e,
                    ) =>
                      setSelectedYear(
                        e
                          .target
                          .value,
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">
                      All
                      Years
                    </option>
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
                    Max
                    Price
                    (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 15m or 15000000"
                    value={
                      maxPrice
                    }
                    onChange={(
                      e,
                    ) =>
                      setMaxPrice(
                        e
                          .target
                          .value,
                      )
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Toggle Button for Advanced Filters */}
              <button
                type="button"
                onClick={() =>
                  setShowAdvancedFilters(
                    !showAdvancedFilters,
                  )
                }
                className="w-full py-2.5 mt-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {showAdvancedFilters
                  ? "- Hide Advanced Filters"
                  : "+ Show More Filters"}
              </button>

              {/* Conditionally Rendered Advanced Filters */}
              {showAdvancedFilters && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Group 2: Specs & Class */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Specifications
                    </h4>

                    {/* Gear and Condition paired to save space */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Gear
                        </label>
                        <select
                          value={
                            selectedTransmission
                          }
                          onChange={(
                            e,
                          ) =>
                            setSelectedTransmission(
                              e
                                .target
                                .value,
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-purple-500"
                        >
                          <option value="">
                            All
                          </option>
                          {TRANSMISSIONS.map(
                            (
                              t,
                            ) => (
                              <option
                                key={
                                  t
                                }
                                value={
                                  t
                                }
                              >
                                {
                                  t
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                          Condition
                        </label>
                        <select
                          value={
                            selectedCondition
                          }
                          onChange={(
                            e,
                          ) =>
                            setSelectedCondition(
                              e
                                .target
                                .value,
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-purple-500"
                        >
                          <option value="">
                            All
                          </option>
                          {CONDITIONS.map(
                            (
                              c,
                            ) => (
                              <option
                                key={
                                  c
                                }
                                value={
                                  c
                                }
                              >
                                {
                                  c
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Body
                        Type
                      </label>
                      <select
                        value={
                          selectedBodyType
                        }
                        onChange={(
                          e,
                        ) =>
                          setSelectedBodyType(
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="">
                          All
                          Body
                          Types
                        </option>
                        {BODY_TYPES.map(
                          (
                            b,
                          ) => (
                            <option
                              key={
                                b
                              }
                              value={
                                b
                              }
                            >
                              {
                                b
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={
                          selectedCategory
                        }
                        onChange={(
                          e,
                        ) =>
                          setSelectedCategory(
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="">
                          All
                          Categories
                        </option>
                        {CATEGORIES.map(
                          (
                            c,
                          ) => (
                            <option
                              key={
                                c
                              }
                              value={
                                c
                              }
                            >
                              {
                                c
                              }
                            </option>
                          ),
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Group 3: Location */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Location
                    </h4>
                    <div>
                      <select
                        value={
                          selectedLocation
                        }
                        onChange={(
                          e,
                        ) =>
                          setSelectedLocation(
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
                      >
                        <option value="">
                          Nationwide
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
              )}
            </div>
          </div>
        </aside>

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Available
              Vehicles
            </h1>
            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
              {
                filteredCars.length
              }{" "}
              Results
            </span>
          </div>

          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <p className="text-slate-500 font-medium animate-pulse">
                Loading
                active
                inventory...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-center">
              <p className="text-red-600 font-semibold mb-3">
                {
                  error
                }
              </p>
              <button
                onClick={
                  fetchCars
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold"
              >
                Retry
              </button>
            </div>
          ) : filteredCars.length ===
            0 ? (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
              <p className="text-slate-600 font-semibold mb-1">
                No
                vehicles
                found.
              </p>
              <p className="text-slate-400 text-sm mb-4">
                Try
                adjusting
                your
                filter
                settings.
              </p>
              <button
                onClick={
                  handleResetFilters
                }
                className="text-purple-600 font-bold hover:underline"
              >
                Clear
                all
                filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map(
                (
                  car,
                ) => (
                  <CarCard
                    key={
                      car._id
                    }
                    car={
                      car
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
