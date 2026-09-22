import {
  useState,
  useEffect,
} from "react";
import CarCard from "../components/CarCard";
import API from "../api/axios";

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

  // Filter States
  const [
    selectedMake,
    setSelectedMake,
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
        // Fetch dynamic vehicles from database endpoint
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

  const handleApplyFilters =
    (
      e,
    ) => {
      e.preventDefault();
      setAppliedFilters(
        {
          make: selectedMake,
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
      setMaxPrice(
        "",
      );
      setAppliedFilters(
        {
          make: "",
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
        // Only showcase active/available inventory on public catalog
        if (
          car.status &&
          car.status !==
            "available"
        ) {
          return false;
        }

        // Filter by Make (matches make field or title)
        if (
          appliedFilters.make
        ) {
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
          ) {
            return false;
          }
        }

        // Filter by Max Price (NGN)
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
          ) {
            return false;
          }
        }

        return true;
      },
    );

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
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

          <div className="space-y-6">
            {/* Make Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Make
              </label>
              <select
                value={
                  selectedMake
                }
                onChange={(
                  e,
                ) =>
                  setSelectedMake(
                    e
                      .target
                      .value,
                  )
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                <option value="">
                  All
                  Makes
                </option>
                <option value="Toyota">
                  Toyota
                </option>
                <option value="Lexus">
                  Lexus
                </option>
                <option value="Mercedes-Benz">
                  Mercedes-Benz
                </option>
                <option value="Honda">
                  Honda
                </option>
                <option value="Land Rover">
                  Land
                  Rover
                  /
                  Range
                  Rover
                </option>
              </select>
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
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
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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

      {/* Inventory Grid */}
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
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
              settings
              or
              check
              back
              after
              adding
              items
              in
              admin.
            </p>
            {(appliedFilters.make ||
              appliedFilters.maxPrice) && (
              <button
                onClick={
                  handleResetFilters
                }
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors text-xs"
              >
                Clear
                Filters
              </button>
            )}
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
