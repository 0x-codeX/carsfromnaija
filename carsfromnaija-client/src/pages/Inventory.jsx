import {
  useState,
  useEffect,
} from "react";
import CarCard from "../components/CarCard";
import API from "../api/axios";

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
    appliedFilters,
    setAppliedFilters,
  ] =
    useState(
      {
        make: "",
        customMake:
          "",
        model:
          "",
        customModel:
          "",
        year: "",
        maxPrice:
          "",
      },
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
      const make =
        e
          .target
          .value;
      setSelectedMake(
        make,
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

  const handleApplyFilters =
    (
      e,
    ) => {
      e.preventDefault();
      setAppliedFilters(
        {
          make: selectedMake,
          customMake:
            customMake,
          model:
            selectedModel,
          customModel:
            customModel,
          year: selectedYear,
          maxPrice:
            maxPrice,
        },
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
      setAppliedFilters(
        {
          make: "",
          customMake:
            "",
          model:
            "",
          customModel:
            "",
          year: "",
          maxPrice:
            "",
        },
      );
    };

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
          appliedFilters.make
        ) {
          if (
            appliedFilters.make ===
            "Other"
          ) {
            if (
              appliedFilters.customMake
            ) {
              const targetMake =
                appliedFilters.customMake.toLowerCase();
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
            } else {
              const carMake =
                car.make ||
                "";
              const isPreset =
                ALL_PRESET_MAKES.some(
                  (
                    p,
                  ) =>
                    p.toLowerCase() ===
                    carMake.toLowerCase(),
                );
              if (
                isPreset
              )
                return false;
            }
          } else {
            const targetMake =
              appliedFilters.make.toLowerCase();
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
          appliedFilters.make ===
            "Other" &&
          appliedFilters.customModel
        ) {
          const targetModel =
            appliedFilters.customModel.toLowerCase();
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
          appliedFilters.model
        ) {
          const targetModel =
            appliedFilters.model.toLowerCase();
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
          appliedFilters.year
        ) {
          if (
            Number(
              car.year,
            ) !==
            Number(
              appliedFilters.year,
            )
          )
            return false;
        }

        if (
          appliedFilters.maxPrice
        ) {
          if (
            Number(
              car.priceNGN,
            ) >
            Number(
              appliedFilters.maxPrice,
            )
          )
            return false;
        }

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

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-72 flex-shrink-0">
        <form
          onSubmit={
            handleApplyFilters
          }
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:sticky md:top-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Search
              Filters
            </h3>
            {(appliedFilters.make ||
              appliedFilters.customMake ||
              appliedFilters.model ||
              appliedFilters.customModel ||
              appliedFilters.year ||
              appliedFilters.maxPrice) && (
              <button
                type="button"
                onClick={
                  handleResetFilters
                }
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-5">
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
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
                    placeholder="e.g. Peugeot, Bugatti"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
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
                placeholder="e.g. 50000000"
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              Apply
              Filters
            </button>
          </div>
        </form>
      </aside>

      <div className="flex-grow">
        <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Available
            Vehicles
          </h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
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
  );
}
