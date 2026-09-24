import {
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MessageCircle,
  AlertCircle,
  Car,
  X,
} from "lucide-react";

export default function BudgetFinder({
  priceGuides = [],
  inventory = [],
  dealerWhatsApp = "2348059975887",
}) {
  const navigate =
    useNavigate();

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

  // Helper parser: Extracts budget range (min & max), year, and text keywords
  const parseSearchQuery =
    (
      rawQuery,
    ) => {
      const trimmed =
        rawQuery
          .trim()
          .toLowerCase();
      if (
        !trimmed
      ) {
        return {
          minBudget:
            null,
          maxBudget:
            null,
          year: null,
          textTokens:
            [],
        };
      }

      // Split by space, handle hyphens for ranges
      const tokens =
        trimmed
          .replace(
            /-/g,
            " ",
          )
          .split(
            /\s+/,
          );
      const numbers =
        [];
      let year =
        null;
      const textTokens =
        [];
      const currentYear =
        new Date().getFullYear() +
        1;

      tokens.forEach(
        (
          token,
        ) => {
          const cleanToken =
            token.replace(
              /,/g,
              "",
            );

          // Ignore common filler words for ranges
          if (
            cleanToken ===
              "to" ||
            cleanToken ===
              "and"
          )
            return;

          let parsedNumber =
            null;

          // 1. Million shorthand e.g., "20m", "20.5m"
          if (
            /^\d+(\.\d+)?m$/i.test(
              cleanToken,
            )
          ) {
            parsedNumber =
              parseFloat(
                cleanToken,
              ) *
              1000000;
          }
          // 2. Thousand shorthand e.g., "500k"
          else if (
            /^\d+(\.\d+)?k$/i.test(
              cleanToken,
            )
          ) {
            parsedNumber =
              parseFloat(
                cleanToken,
              ) *
              1000;
          }
          // 3. Pure numbers
          else if (
            /^\d+(\.\d+)?$/.test(
              cleanToken,
            )
          ) {
            const val =
              parseFloat(
                cleanToken,
              );

            // 4-digit year check (1990 - currentYear)
            if (
              val >=
                1990 &&
              val <=
                currentYear &&
              Number.isInteger(
                val,
              )
            ) {
              year =
                val;
              return;
            }

            // Nigerian shorthand: numbers <= 200 treated as millions
            if (
              val >
                0 &&
              val <=
                200
            ) {
              parsedNumber =
                val *
                1000000;
            } else if (
              val >
              200
            ) {
              parsedNumber =
                val;
            }
          }

          if (
            parsedNumber !==
            null
          ) {
            numbers.push(
              parsedNumber,
            );
          } else {
            // 4. Text token (Make, Model, Category)
            textTokens.push(
              token,
            );
          }
        },
      );

      let minBudget =
        null;
      let maxBudget =
        null;

      if (
        numbers.length ===
        1
      ) {
        minBudget =
          numbers[0];
        const valStr =
          Math.floor(
            numbers[0],
          ).toString();
        // Replace trailing zeros with 9s to form the upper range limit
        const maxStr =
          valStr.replace(
            /0+$/,
            (
              zeros,
            ) =>
              "9".repeat(
                zeros.length,
              ),
          );
        maxBudget =
          parseFloat(
            maxStr,
          );
      } else if (
        numbers.length >=
        2
      ) {
        // Explicit range provided (e.g. 10m to 20m)
        minBudget =
          Math.min(
            numbers[0],
            numbers[1],
          );
        maxBudget =
          Math.max(
            numbers[0],
            numbers[1],
          );
      }

      return {
        minBudget,
        maxBudget,
        year,
        textTokens,
      };
    };

  // Real-time search effect triggers on every keystroke
  useEffect(() => {
    if (
      !searchQuery.trim()
    ) {
      setResults(
        [],
      );
      setHasSearched(
        false,
      );
      return;
    }

    const {
      minBudget,
      maxBudget,
      year,
      textTokens,
    } =
      parseSearchQuery(
        searchQuery,
      );

    // 1. Search Active Inventory
    const matchedInventory =
      inventory
        .filter(
          (
            car,
          ) => {
            // Filter by dynamic budget range (car price must be within min & max range)
            if (
              minBudget !==
                null &&
              maxBudget !==
                null
            ) {
              if (
                car.priceNGN <
                  minBudget ||
                car.priceNGN >
                  maxBudget
              )
                return false;
            }

            // Filter by year
            if (
              year !==
                null &&
              car.year !==
                year
            )
              return false;

            // Filter by text keywords (Make, Model, Title, Category)
            if (
              textTokens.length >
              0
            ) {
              const searchableString =
                `${car.year || ""} ${car.make || ""} ${car.model || ""} ${car.title || ""} ${car.category || ""}`.toLowerCase();
              const matchesAll =
                textTokens.every(
                  (
                    token,
                  ) =>
                    searchableString.includes(
                      token,
                    ),
                );
              if (
                !matchesAll
              )
                return false;
            }

            return true;
          },
        )
        .map(
          (
            car,
          ) => ({
            ...car,
            isInventory: true,
          }),
        );

    // 2. Search Market Price Guides
    const matchedGuides =
      priceGuides
        .filter(
          (
            guide,
          ) => {
            // Filter by budget: guide price range must overlap with searched range
            if (
              minBudget !==
                null &&
              maxBudget !==
                null
            ) {
              const guideMin =
                guide.priceMinNGN ||
                0;
              const guideMax =
                guide.priceMaxNGN ||
                guideMin;
              if (
                guideMin >
                  maxBudget ||
                guideMax <
                  minBudget
              )
                return false;
            }

            // Filter by year: guide year range must include year
            if (
              year !==
                null &&
              !(
                year >=
                  guide.yearStart &&
                year <=
                  guide.yearEnd
              )
            ) {
              return false;
            }

            // Filter by text keywords
            if (
              textTokens.length >
              0
            ) {
              const searchableString =
                `${guide.yearStart || ""}-${guide.yearEnd || ""} ${guide.make || ""} ${guide.model || ""} ${guide.category || ""}`.toLowerCase();
              const matchesAll =
                textTokens.every(
                  (
                    token,
                  ) =>
                    searchableString.includes(
                      token,
                    ),
                );
              if (
                !matchesAll
              )
                return false;
            }

            return true;
          },
        )
        .map(
          (
            guide,
          ) => ({
            ...guide,
            isInventory: false,
          }),
        );

    // 3. Sort high-to-low closest to top budget
    if (
      minBudget !==
      null
    ) {
      matchedInventory.sort(
        (
          a,
          b,
        ) =>
          b.priceNGN -
          a.priceNGN,
      );
      matchedGuides.sort(
        (
          a,
          b,
        ) =>
          b.priceMinNGN -
          a.priceMinNGN,
      );
    }

    setResults(
      [
        ...matchedInventory,
        ...matchedGuides,
      ],
    );
    setHasSearched(
      true,
    );
  }, [
    searchQuery,
    inventory,
    priceGuides,
  ]);

  const handleSubmit =
    (
      e,
    ) => {
      e.preventDefault();
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
      item,
    ) => {
      let message =
        "";

      // Dynamic messaging based on whether it's available in inventory or just a guide
      if (
        item.isInventory
      ) {
        message = `Hello, I am interested in the ${item.year} ${item.make} ${item.model} currently in your inventory, priced at ₦${item.priceNGN.toLocaleString()}. Is this vehicle still available?`;
      } else {
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
        message = `Hello, I am looking to source a ${item.yearStart}-${item.yearEnd} ${item.make} ${item.model}${budgetContext}. Can you help me find one?`;
      }

      // Strips out all non-digit characters (spaces, pluses, dashes) to ensure a valid wa.me link
      const cleanPhone =
        dealerWhatsApp.replace(
          /\D/g,
          "",
        );
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

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
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/90 text-slate-900 border-none focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all placeholder:text-slate-500 font-medium text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-lg"
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
                  item,
                  index,
                ) => {
                  // Determine image based on data structure
                  const imageUrl =
                    item.isInventory
                      ? item.mainImage
                      : item
                          .images
                          ?.front ||
                        item.imageUrl;

                  return (
                    <div
                      key={
                        index
                      }
                      onClick={() => {
                        closeResults(); // Closes the search dropdown
                        if (
                          item.isInventory
                        ) {
                          // Navigates to the specific car details page matching the View Details button
                          navigate(
                            `/car/${item._id}`,
                          );
                        } else {
                          // Navigates to the market guide page
                          navigate(
                            `/market-price-guide`,
                          );
                        }
                      }}
                      className={`flex gap-4 p-3 bg-white border rounded-lg transition-shadow hover:shadow-md cursor-pointer ${
                        item.isInventory
                          ? "border-purple-200 shadow-sm"
                          : "border-slate-100 shadow-sm"
                      }`}
                    >
                      <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 relative">
                        {imageUrl ? (
                          <img
                            src={
                              imageUrl
                            }
                            alt={
                              item.model
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
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {item.isInventory
                                ? item.title ||
                                  `${item.year} ${item.make} ${item.model}`
                                : `${item.make} ${item.model}`}
                            </h4>
                            {item.isInventory && (
                              <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                In
                                Stock
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {item.isInventory
                              ? item.year
                              : `${item.yearStart}-${item.yearEnd}`}{" "}
                            |{" "}
                            {item.category ||
                              "Regular"}
                          </p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-xs font-bold text-purple-600">
                            ₦
                            {item.isInventory
                              ? (
                                  item.priceNGN /
                                  1000000
                                ).toFixed(
                                  1,
                                )
                              : (
                                  item.priceMinNGN /
                                  1000000
                                ).toFixed(
                                  1,
                                )}

                            M
                            {item.isInventory
                              ? ""
                              : "+"}
                          </p>
                          <button
                            onClick={(
                              e,
                            ) => {
                              e.stopPropagation(); // Prevents the card's onClick from firing when clicking the button
                              handleWhatsAppInquiry(
                                item,
                              );
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors z-10 relative"
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
                  );
                },
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
                  onClick={() => {
                    const cleanPhone =
                      dealerWhatsApp.replace(
                        /\D/g,
                        "",
                      );
                    window.open(
                      `https://wa.me/${cleanPhone}?text=Hello, I need you to source a ${encodeURIComponent(
                        searchQuery,
                      )}.`,
                      "_blank",
                    );
                  }}
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
