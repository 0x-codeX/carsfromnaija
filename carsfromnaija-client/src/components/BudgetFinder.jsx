import {
  useState,
  useEffect,
} from "react";
import {
  Search,
  MessageCircle,
  AlertCircle,
  Car,
  X,
} from "lucide-react";

export default function BudgetFinder({
  priceGuides = [],
  dealerWhatsApp = "2348059975887",
}) {
  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState(
      "",
    );
  const [
    results,
    setResults,
  ] =
    useState(
      [],
    );
  const [
    hasSearched,
    setHasSearched,
  ] =
    useState(
      false,
    );
  const [
    placeholder,
    setPlaceholder,
  ] =
    useState(
      "Budget (e.g. 15000000)",
    );

  const placeholderOptions =
    [
      "Budget (e.g. 15000000)",
      "Make/Model (e.g. Toyota)",
      "Class (e.g. Luxury)",
      "Year (e.g. 2021)",
    ];

  useEffect(() => {
    let i = 0;
    const interval =
      setInterval(
        () => {
          i =
            (i +
              1) %
            placeholderOptions.length;
          setPlaceholder(
            placeholderOptions[
              i
            ],
          );
        },
        3000,
      );
    return () =>
      clearInterval(
        interval,
      );
  }, []);

  const handleSubmit =
    (
      e,
    ) => {
      e.preventDefault();
      const query =
        searchQuery
          .trim()
          .toLowerCase();
      if (
        !query
      )
        return;

      const numericQuery =
        Number(
          query,
        );
      const isNumeric =
        !isNaN(
          numericQuery,
        ) &&
        numericQuery >
          0;

      const matchedCars =
        priceGuides.filter(
          (
            guide,
          ) => {
            if (
              isNumeric
            ) {
              if (
                numericQuery >=
                  1990 &&
                numericQuery <=
                  new Date().getFullYear() +
                    1
              ) {
                if (
                  numericQuery >=
                    guide.yearStart &&
                  numericQuery <=
                    guide.yearEnd
                )
                  return true;
              }
              if (
                numericQuery >=
                guide.priceMinNGN
              )
                return true;
            }
            const make =
              (
                guide.make ||
                ""
              ).toLowerCase();
            const model =
              (
                guide.model ||
                ""
              ).toLowerCase();
            const category =
              (
                guide.category ||
                ""
              ).toLowerCase();
            return (
              make.includes(
                query,
              ) ||
              model.includes(
                query,
              ) ||
              category.includes(
                query,
              ) ||
              `${make} ${model}`.includes(
                query,
              )
            );
          },
        );

      if (
        isNumeric &&
        numericQuery >
          1000000
      ) {
        matchedCars.sort(
          (
            a,
            b,
          ) =>
            b.priceMinNGN -
            a.priceMinNGN,
        );
      }

      setResults(
        matchedCars,
      );
      setHasSearched(
        true,
      );
    };

  const closeResults =
    () => {
      setHasSearched(
        false,
      );
      setSearchQuery(
        "",
      );
    };

  const handleWhatsAppInquiry =
    (
      car,
    ) => {
      const isNumeric =
        !isNaN(
          Number(
            searchQuery,
          ),
        ) &&
        Number(
          searchQuery,
        ) >
          1000000;
      const budgetContext =
        isNumeric
          ? ` with a budget around ₦${Number(searchQuery).toLocaleString()}`
          : "";
      const message = `Hello, I am interested in a ${car.yearStart}-${car.yearEnd} ${car.make} ${car.model}${budgetContext}.`;
      const url = `https://wa.me/${dealerWhatsApp.replace(/\+/g, "")}?text=${encodeURIComponent(message)}`;
      window.open(
        url,
        "_blank",
      );
    };

  return (
    <div className="w-full relative z-50">
      {/* Compact Widget Box */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-2">
          Search
          Inventory
        </h2>
        <p className="text-slate-300 mb-5 text-xs">
          Search
          by
          budget,
          model,
          year,
          or
          class.
        </p>

        <form
          onSubmit={
            handleSubmit
          }
          className="flex flex-col gap-3"
        >
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search
                size={
                  18
                }
              />
            </span>
            <input
              type="text"
              value={
                searchQuery
              }
              onChange={(
                e,
              ) =>
                setSearchQuery(
                  e
                    .target
                    .value,
                )
              }
              placeholder={
                placeholder
              }
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 text-slate-900 border-none focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-500 font-medium text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-lg"
          >
            Find
            Vehicles
          </button>
        </form>
      </div>

      {/* Floating Results Panel */}
      {hasSearched && (
        <div className="absolute top-[105%] left-0 w-full lg:w-[600px] lg:-ml-[150px] bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100] max-h-[70vh] flex flex-col animate-in fade-in slide-in-from-top-4">
          {/* Results Header */}
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
            <h3 className="text-sm font-bold text-slate-900">
              Results
              for
              "
              {
                searchQuery
              }
              "
            </h3>
            <button
              onClick={
                closeResults
              }
              className="text-slate-500 hover:text-slate-900 bg-slate-200 p-1.5 rounded-full transition-colors"
            >
              <X
                size={
                  16
                }
              />
            </button>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-4 space-y-4">
            {results.length >
            0 ? (
              results.map(
                (
                  car,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="flex gap-4 p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 relative">
                      {car.imageUrl ? (
                        <img
                          src={
                            car.imageUrl
                          }
                          alt={
                            car.model
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Car
                          size={
                            24
                          }
                          className="opacity-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                      )}
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {
                            car.make
                          }{" "}
                          {
                            car.model
                          }
                        </h4>
                        <p className="text-xs text-slate-500">
                          {
                            car.yearStart
                          }
                          -
                          {
                            car.yearEnd
                          }{" "}
                          |{" "}
                          {car.category ||
                            "Regular"}
                        </p>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-xs font-bold text-blue-700">
                          ₦
                          {(
                            car.priceMinNGN /
                            1000000
                          ).toFixed(
                            1,
                          )}
                          M+
                        </p>
                        <button
                          onClick={() =>
                            handleWhatsAppInquiry(
                              car,
                            )
                          }
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle
                            size={
                              14
                            }
                          />{" "}
                          DM
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="text-center py-8">
                <AlertCircle
                  size={
                    24
                  }
                  className="text-slate-400 mx-auto mb-2"
                />
                <h4 className="text-sm font-bold text-slate-900">
                  No
                  matches
                </h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  We
                  didn't
                  find
                  exact
                  pricing,
                  but
                  we
                  can
                  source
                  it.
                </p>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${dealerWhatsApp.replace(/\+/g, "")}?text=Hello, I need you to source a ${encodeURIComponent(searchQuery)}.`,
                      "_blank",
                    )
                  }
                  className="bg-slate-900 text-white px-4 py-2 rounded-md text-xs font-bold"
                >
                  Request
                  Custom
                  Sourcing
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
