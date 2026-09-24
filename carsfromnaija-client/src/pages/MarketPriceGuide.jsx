import {
  useState,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Car,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  ArrowLeft,
  Search,
} from "lucide-react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Add this sub-component right below the imports
function GuideCard({
  guide,
  contact,
  formatPrice,
  cleanWhatsAppNumber,
  onOpenModal,
}) {
  // Extract images from the object and filter out empty strings/nulls
  const imagesArr =
    [
      guide
        .images
        ?.front,
      guide
        .images
        ?.back,
      guide
        .images
        ?.interior,
    ].filter(
      Boolean,
    );
  const displayImages =
    imagesArr.length >
    0
      ? imagesArr
      : [
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80",
        ];

  const [
    currentImg,
    setCurrentImg,
  ] =
    useState(
      0,
    );

  const handlePrev =
    (
      e,
    ) => {
      e.stopPropagation();
      setCurrentImg(
        (
          prev,
        ) =>
          prev ===
          0
            ? displayImages.length -
              1
            : prev -
              1,
      );
    };

  const handleNext =
    (
      e,
    ) => {
      e.stopPropagation();
      setCurrentImg(
        (
          prev,
        ) =>
          prev ===
          displayImages.length -
            1
            ? 0
            : prev +
              1,
      );
    };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1 group">
      {/* Image Carousel Section */}
      <div
        className="relative h-48 bg-slate-200 overflow-hidden cursor-pointer"
        onClick={() =>
          onOpenModal(
            displayImages,
            currentImg,
          )
        }
      >
        <img
          src={
            displayImages[
              currentImg
            ]
          }
          alt={`${guide.make} ${guide.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(
            e,
          ) =>
            (e.target.src =
              "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80")
          }
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 uppercase tracking-wider shadow-sm z-10">
          {
            guide.category
          }
        </div>

        {/* Enlarge Icon */}
        <button
          type="button"
          onClick={(
            e,
          ) => {
            e.stopPropagation();
            onOpenModal(
              displayImages,
              currentImg,
            );
          }}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
          title="Click to Enlarge"
        >
          <Maximize2
            size={
              16
            }
          />
        </button>

        {/* Carousel Navigation Arrows */}
        {displayImages.length >
          1 && (
          <>
            <button
              onClick={
                handlePrev
              }
              type="button"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
            >
              <ChevronLeft
                size={
                  18
                }
              />
            </button>
            <button
              onClick={
                handleNext
              }
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:outline-none z-10"
            >
              <ChevronRight
                size={
                  18
                }
              />
            </button>
            {/* Image Indicator Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {displayImages.map(
                (
                  _,
                  idx,
                ) => (
                  <div
                    key={
                      idx
                    }
                    className={`h-1.5 rounded-full transition-all ${idx === currentImg ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                ),
              )}
            </div>
          </>
        )}
      </div>

      {/* Details & CTA Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {
              guide.make
            }{" "}
            {
              guide.model
            }
          </h3>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Years:{" "}
            {
              guide.yearStart
            }{" "}
            -{" "}
            {
              guide.yearEnd
            }
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex-grow mb-5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
            Estimated
            Budget
          </p>
          <p className="text-base font-bold text-emerald-600">
            {formatPrice(
              guide.priceMinNGN,
            )}{" "}
            <span className="text-slate-400 text-sm font-normal mx-1">
              to
            </span>{" "}
            {formatPrice(
              guide.priceMaxNGN,
            )}
          </p>
        </div>

        {/* Dynamic WhatsApp CTA */}
        <a
          href={`https://wa.me/${cleanWhatsAppNumber(contact.whatsapp)}?text=Hi%2C%20I%20saw%20the%20market%20guide%20for%20the%20${guide.yearStart}-${guide.yearEnd}%20${guide.make}%20${guide.model}.%20Can%20we%20talk%20about%20acquiring%20one%20within%20my%20budget%3F`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
        >
          <MessageSquare
            size={
              16
            }
          />
          Contact
          to
          Acquire
        </a>
      </div>
    </div>
  );
}

// Helper parser: Extracts budget range (min & max), year, and text keywords
  const parseSearchQuery = (rawQuery) => {
    const trimmed = rawQuery.trim().toLowerCase();
    if (!trimmed) {
      return { minBudget: null, maxBudget: null, year: null, textTokens: [] };
    }

    // Split by space, handle hyphens for ranges
    const tokens = trimmed.replace(/-/g, " ").split(/\s+/);
    const numbers = [];
    let year = null;
    const textTokens = [];
    const currentYear = new Date().getFullYear() + 1;

    tokens.forEach((token) => {
      const cleanToken = token.replace(/,/g, "");

      // Ignore common filler words for ranges
      if (cleanToken === "to" || cleanToken === "and") return;

      let parsedNumber = null;

      // 1. Million shorthand e.g., "20m", "20.5m"
      if (/^\d+(\.\d+)?m$/i.test(cleanToken)) {
        parsedNumber = parseFloat(cleanToken) * 1000000;
      }
      // 2. Thousand shorthand e.g., "500k"
      else if (/^\d+(\.\d+)?k$/i.test(cleanToken)) {
        parsedNumber = parseFloat(cleanToken) * 1000;
      }
      // 3. Pure numbers
      else if (/^\d+(\.\d+)?$/.test(cleanToken)) {
        const val = parseFloat(cleanToken);

        // 4-digit year check (1990 - currentYear)
        if (val >= 1990 && val <= currentYear && Number.isInteger(val)) {
          year = val;
          return;
        }

        // Nigerian shorthand: numbers <= 200 treated as millions
        if (val > 0 && val <= 200) {
          parsedNumber = val * 1000000;
        } else if (val > 200) {
          parsedNumber = val;
        }
      }

      if (parsedNumber !== null) {
        numbers.push(parsedNumber);
      } else {
        // 4. Text token (Make, Model, Category)
        textTokens.push(token);
      }
    });

    let minBudget = null;
    let maxBudget = null;

    if (numbers.length === 1) {
      minBudget = numbers[0];
      const valStr = Math.floor(numbers[0]).toString();
      // Replace trailing zeros with 9s to form the upper range limit
      const maxStr = valStr.replace(/0+$/, (zeros) => "9".repeat(zeros.length));
      maxBudget = parseFloat(maxStr);
    } else if (numbers.length >= 2) {
      // Explicit range provided (e.g. 10m to 20m)
      minBudget = Math.min(numbers[0], numbers[1]);
      maxBudget = Math.max(numbers[0], numbers[1]);
    }

    return { minBudget, maxBudget, year, textTokens };
  };

export default function MarketPriceGuide() {
  const [
    guides,
    setGuides,
  ] =
    useState(
      [],
    );
  const [
    contact,
    setContact,
  ] =
    useState(
      {
        whatsapp:
          "",
        email:
          "",
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
    guideSearch,
    setGuideSearch,
  ] =
    useState(
      "",
    );

  const [
    modalData,
    setModalData,
  ] =
    useState(
      {
        isOpen: false,
        images:
          [],
        currentIndex: 0,
      },
    );

  const openModal =
    (
      images,
      index,
    ) => {
      setModalData(
        {
          isOpen: true,
          images,
          currentIndex:
            index,
        },
      );
    };

  const closeModal =
    () => {
      setModalData(
        {
          ...modalData,
          isOpen: false,
        },
      );
    };

  const modalNextImage =
    (
      e,
    ) => {
      e.stopPropagation();
      setModalData(
        (
          prev,
        ) => ({
          ...prev,
          currentIndex:
            prev.currentIndex ===
            prev
              .images
              .length -
              1
              ? 0
              : prev.currentIndex +
                1,
        }),
      );
    };

  const modalPrevImage =
    (
      e,
    ) => {
      e.stopPropagation();
      setModalData(
        (
          prev,
        ) => ({
          ...prev,
          currentIndex:
            prev.currentIndex ===
            0
              ? prev
                  .images
                  .length -
                1
              : prev.currentIndex -
                1,
        }),
      );
    };

  useEffect(() => {
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
            setGuides(
              response
                .data
                .priceGuides ||
                [],
            );
            setContact(
              {
                whatsapp:
                  response
                    .data
                    .dealerPhoneWhatsApp ||
                  "",
                email:
                  response
                    .data
                    .dealerEmail ||
                  "",
              },
            );
          }
        } catch (error) {
          console.error(
            "Failed to load price guides:",
            error,
          );
        } finally {
          setLoading(
            false,
          );
        }
      };
    fetchSettings();
  }, []);

  const formatPrice =
    (
      price,
    ) => {
      if (
        !price
      )
        return "N/A";
      return new Intl.NumberFormat(
        "en-NG",
        {
          style:
            "currency",
          currency:
            "NGN",
          maximumFractionDigits: 0,
        },
      ).format(
        price,
      );
    };

  // Strip characters for the WhatsApp link
  const cleanWhatsAppNumber =
    (
      number,
    ) => {
      return number
        .replace(
          /[^\w\s]/gi,
          "",
        )
        .replace(
          /\s+/g,
          "",
        );
    };

  if (
    loading
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Car
          size={
            32
          }
          className="text-slate-400 animate-bounce"
        />
        <div className="text-lg font-bold text-slate-500">
          Loading
          Market
          Guides...
        </div>
      </div>
    );
  }

  const {
    minBudget,
    maxBudget,
    year,
    textTokens,
  } =
    parseSearchQuery(
      guideSearch,
    );

  const filteredGuides =
    guides.filter(
      (
        guide,
      ) => {
        // 1. Filter by budget range overlap
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

          // Exclude if guide price range doesn't overlap with searched budget
          if (
            guideMin >
              maxBudget ||
            guideMax <
              minBudget
          ) {
            return false;
          }
        }

        // 2. Filter by year range
        if (
          year !==
          null
        ) {
          if (
            !(
              year >=
                guide.yearStart &&
              year <=
                guide.yearEnd
            )
          ) {
            return false;
          }
        }

        // 3. Filter by text keywords (Make, Model, Category)
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
    );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Back Navigation Button */}
          <div className="sticky top-20 z-40 w-fit pointer-events-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-slate-800 hover:text-purple-700 bg-white/90 backdrop-blur-md border border-slate-200 rounded-lg hover:bg-white transition-all text-sm font-bold shadow-md"
            >
              <ArrowLeft
                size={
                  16
                }
              />
              Return
              to
              Home
            </Link>
          </div>

          {/* Informational Header Section */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Market
              Price
              Guides
            </h1>

            {/* Dealer Context State */}
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-left">
              <AlertCircle
                size={
                  32
                }
                className="text-purple-600 flex-shrink-0"
              />
              <div>
                <p className="text-lg text-purple-900 font-bold mb-1">
                  Don't
                  see
                  it
                  in
                  our
                  active
                  inventory?
                  No
                  problem.
                </p>
                <p className="text-purple-800 text-sm md:text-base leading-relaxed">
                  The
                  vehicles
                  listed
                  below
                  represent
                  current
                  market
                  estimates
                  for
                  popular
                  models
                  we
                  frequently
                  source.
                  Even
                  if
                  we
                  don't
                  currently
                  have
                  it
                  in
                  stock,{" "}
                  <strong>
                    we
                    can
                    help
                    you
                    acquire
                    this
                    vehicle
                    or
                    any
                    other
                    that
                    fits
                    your
                    budget.
                  </strong>{" "}
                  Browse
                  the
                  guides,
                  check
                  the
                  prices,
                  and
                  let's
                  talk!
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Budget & Model Search Bar */}
          <div className="max-w-md mx-auto mb-8 relative">
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
                guideSearch
              }
              onChange={(
                e,
              ) =>
                setGuideSearch(
                  e
                    .target
                    .value,
                )
              }
              placeholder="Filter by budget (e.g. 15m), year, or model..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-300 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm text-slate-900 placeholder:text-slate-400 font-medium"
            />
            {guideSearch && (
              <button
                type="button"
                onClick={() =>
                  setGuideSearch(
                    "",
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full"
              >
                <X
                  size={
                    16
                  }
                />
              </button>
            )}
          </div>

          {/* Grid of Price Guides */}
          {/* REPLACE THE GUIDES GRID CONTAINER WITH THIS: */}
          {guides.length ===
          0 ? (
            <div className="text-center bg-white p-12 rounded-2xl border border-slate-200 text-slate-500">
              No
              market
              guides
              are
              currently
              available.
              Check
              back
              soon!
            </div>
          ) : filteredGuides.length ===
            0 ? (
            <div className="text-center bg-white p-12 rounded-2xl border border-slate-200 text-slate-500">
              <AlertCircle
                size={
                  32
                }
                className="mx-auto mb-2 text-slate-400"
              />
              <p className="font-bold text-slate-700">
                No
                matching
                market
                guides
                found
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Try
                adjusting
                your
                budget
                or
                search
                keywords
                (e.g.
                "15m",
                "Toyota",
                "2020").
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGuides.map(
                (
                  guide,
                  index,
                ) => (
                  <GuideCard
                    key={
                      index
                    }
                    guide={
                      guide
                    }
                    contact={
                      contact
                    }
                    formatPrice={
                      formatPrice
                    }
                    cleanWhatsAppNumber={
                      cleanWhatsAppNumber
                    }
                    onOpenModal={
                      openModal
                    }
                  />
                ),
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Enlarged Image Lightbox Modal */}
      {modalData.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={
            closeModal
          }
        >
          {/* Close Button */}
          <button
            onClick={
              closeModal
            }
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm transition-all z-[60]"
            aria-label="Close preview"
          >
            <X
              size={
                24
              }
            />
          </button>

          {/* Modal Container */}
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center select-none"
            onClick={(
              e,
            ) =>
              e.stopPropagation()
            }
          >
            <img
              src={
                modalData
                  .images[
                  modalData
                    .currentIndex
                ]
              }
              alt="Enlarged vehicle view"
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Modal Left & Right Navigation Controls */}
            {modalData
              .images
              .length >
              1 && (
              <>
                <button
                  onClick={
                    modalPrevImage
                  }
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-white/20 transition-all backdrop-blur-sm active:scale-95 z-[60]"
                  aria-label="Previous image"
                >
                  <ChevronLeft
                    size={
                      28
                    }
                  />
                </button>

                <button
                  onClick={
                    modalNextImage
                  }
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-white/20 transition-all backdrop-blur-sm active:scale-95 z-[60]"
                  aria-label="Next image"
                >
                  <ChevronRight
                    size={
                      28
                    }
                  />
                </button>

                {/* Modal Counter */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-sm font-medium tracking-wide">
                  {modalData.currentIndex +
                    1}{" "}
                  of{" "}
                  {
                    modalData
                      .images
                      .length
                  }
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
