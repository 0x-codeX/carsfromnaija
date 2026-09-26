import { Helmet } from "react-helmet-async";
import {
  useState,
  useEffect,
} from "react";
import {
  useParams,
  Link,
  useLocation,
} from "react-router-dom";
import {
  CheckCircle2,
  MessageCircle,
  Mail,
  ArrowLeft,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
} from "lucide-react";
import CostCalculator from "../components/CostCalculator";
import API from "../api/axios";

export default function CarDetail() {
  const location =
    useLocation();
  // Check if the router state contains the admin flag
  const isAdminView =
    location
      .state
      ?.fromAdmin;

  // Dynamically set the route and text
  const backRoute =
    isAdminView
      ? "/admin/inventory"
      : "/inventory";
  const backText =
    isAdminView
      ? "Back to Inventory Management"
      : "Return to Inventory";
  const {
    id,
  } =
    useParams();

  const [
    car,
    setCar,
  ] =
    useState(
      null,
    );
  const [
    settings,
    setSettings,
  ] =
    useState(
      null,
    );
  const [
    activeImage,
    setActiveImage,
  ] =
    useState(
      0,
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
    isModalOpen,
    setIsModalOpen,
  ] =
    useState(
      false,
    );

  useEffect(() => {
    const fetchCarAndSettings =
      async () => {
        try {
          setLoading(
            true,
          );
          setError(
            null,
          );

          // Concurrent fetching for both the car details and global backend settings
          const [
            carResponse,
            settingsResponse,
          ] =
            await Promise.all(
              [
                API.get(
                  `/cars/${id}`,
                ),
                API.get(
                  "/settings",
                ),
              ],
            );

          setCar(
            carResponse.data,
          );
          setSettings(
            settingsResponse.data,
          );
        } catch (err) {
          console.error(
            "Error fetching vehicle details:",
            err,
          );
          setError(
            "Failed to load vehicle details. Please try again later.",
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    if (
      id
    ) {
      fetchCarAndSettings();
    }
  }, [
    id,
  ]);

  if (
    loading
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500 font-semibold gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p>
          Fetching
          vehicle
          details...
        </p>
      </div>
    );
  }

  if (
    error ||
    !car
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle
          size={
            48
          }
          className="text-red-500 mb-4"
        />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Vehicle
          Not
          Found
        </h2>
        <p className="text-slate-500 max-w-md mb-6">
          {error ||
            "The vehicle listing you are looking for does not exist or has been removed."}
        </p>
        <Link
          to="/"
          className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
        >
          Back
          to
          Inventory
        </Link>
      </div>
    );
  }

  const getImageUrl =
    (
      img,
    ) => {
      if (
        !img
      )
        return "/logo.png";
      return typeof img ===
        "string"
        ? img
        : img.url ||
            img.secure_url;
    };

  const images =
    car.images &&
    car
      .images
      .length >
      0
      ? car.images
      : [];
  const mainImageUrl =
    getImageUrl(
      images[
        activeImage
      ],
    );

  const isNegotiable =
    car.isNegotiable ===
      true ||
    car.isNegotiable ===
      "true";

  const handleWhatsApp =
    () => {
      const rawPhoneNumber =
        settings?.dealerPhoneWhatsApp ||
        "2348059975887";
      const cleanPhone =
        rawPhoneNumber.replace(
          /\D/g,
          "",
        );

      const formattedPrice =
        car.priceNGN
          ? Number(
              car.priceNGN,
            ).toLocaleString()
          : "N/A";
      const pageUrl =
        window
          .location
          .href;

      const text = `Hello! I am interested in the ${car.title || "vehicle"} listed for ₦${formattedPrice}.\n\nListing Link: ${pageUrl}\nImage: ${mainImageUrl}\n\nIs it still available?`;

      window.open(
        `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`,
        "_blank",
      );
    };

  const dealerEmail =
    settings?.dealerEmail ||
    "sales@carsfromnaija.com";

  const emailBody = `Hello,\n\nI am interested in this vehicle listing:\n\nTitle: ${car.title || "Vehicle"}\nPrice: ₦${car.priceNGN ? Number(car.priceNGN).toLocaleString() : "Contact for price"}\n\nListing Link: ${window.location.href}\nImage Reference: ${mainImageUrl}\n\nIs it still available?`;

  const carSchema =
    {
      "@context":
        "https://schema.org/",
      "@type":
        "Vehicle",
      name: car.title,
      image:
        mainImageUrl,
      description: `For sale in ${car.location || "Lagos"}, Nigeria: ${car.year || ""} ${car.make || ""} ${car.model || ""}.`,
      brand:
        {
          "@type":
            "Brand",
          name:
            car.make ||
            "Unknown",
        },
      offers:
        {
          "@type":
            "Offer",
          url: window
            .location
            .href,
          priceCurrency:
            "NGN",
          price:
            car.priceNGN ||
            0,
          itemCondition:
            car.condition ===
            "Brand New"
              ? "https://schema.org/NewCondition"
              : "https://schema.org/UsedCondition",
          availability:
            "https://schema.org/InStock",
          eligibleRegion:
            {
              "@type":
                "Country",
              name: "Nigeria",
            },
        },
    };

    const handlePrevImage =
      () => {
        if (
          images.length <=
          1
        )
          return;
        setActiveImage(
          (
            prev,
          ) =>
            prev ===
            0
              ? images.length -
                1
              : prev -
                1,
        );
      };

    const handleNextImage =
      () => {
        if (
          images.length <=
          1
        )
          return;
        setActiveImage(
          (
            prev,
          ) =>
            prev ===
            images.length -
              1
              ? 0
              : prev +
                1,
        );
      };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* SEO INJECTION START */}
      <Helmet>
        <title>{`${car.title} for Sale in ${car.location || "Lagos"}, Nigeria | CarsFromNaija`}</title>
        <meta
          name="description"
          content={`Buy this ${car.condition || "used"} ${car.year || ""} ${car.make || ""} ${car.model || ""} in ${car.location || "Lagos"}. Price: ₦${car.priceNGN ? Number(car.priceNGN).toLocaleString() : "Contact for price"}. Contact us on WhatsApp today.`}
        />
        <meta
          property="og:title"
          content={`${car.title} for Sale in ${car.location || "Lagos"}`}
        />
        <meta
          property="og:description"
          content={`Available now in ${car.location || "Lagos"} for ₦${car.priceNGN ? Number(car.priceNGN).toLocaleString() : "Contact for price"}.`}
        />
        <meta
          property="og:image"
          content={
            mainImageUrl
          }
        />
      </Helmet>
      <script type="application/ld+json">
        {JSON.stringify(
          carSchema,
        )}
      </script>
      {/* Sticky Back Button Container */}
      <div className="sticky top-[80px] z-40 mb-6 py-1 px-1 bg-white/80 backdrop-blur-lg border border-slate-200 shadow-sm rounded-xl w-max">
        <Link
          to={
            backRoute
          }
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 font-bold text-sm hover:text-blue-700 bg-transparent rounded-lg transition-colors"
        >
          <ArrowLeft
            size={
              18
            }
          />
          {
            backText
          }
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Media Only */}
        <div className="space-y-6">
          <div className="block lg:hidden mb-2">
            {/* Tags Container: Placed ABOVE the title */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {car.category && (
                <span className="flex-shrink-0 whitespace-nowrap bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {
                    car.category
                  }
                </span>
              )}
              {car.condition && (
                <span className="flex-shrink-0 whitespace-nowrap bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {
                    car.condition
                  }
                </span>
              )}
              {car.bodyType && (
                <span className="flex-shrink-0 whitespace-nowrap bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {
                    car.bodyType
                  }
                </span>
              )}
              {isNegotiable && (
                <span className="flex-shrink-0 whitespace-nowrap bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Negotiable
                </span>
              )}
            </div>

            {/* Title: Placed BELOW the tags */}
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
              {
                car.title
              }{" "}
              <span className="text-lg text-slate-600 block">
                in{" "}
                {car.location ||
                  "Lagos"}

                ,
                Nigeria
              </span>
            </h1>

            <p className="text-2xl font-black text-blue-600">
              ₦
              {car.priceNGN
                ? Number(
                    car.priceNGN,
                  ).toLocaleString()
                : "Contact for price"}
            </p>
          </div>

          {/* Main Display Image */}
          <div className="relative group bg-slate-100 rounded-2xl overflow-hidden h-80 md:h-96 border border-slate-200 cursor-pointer">
            <img
              src={
                mainImageUrl
              }
              alt={
                car.title ||
                "Vehicle display"
              }
              className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
              onClick={() =>
                setIsModalOpen(
                  true,
                )
              }
              onError={(
                e,
              ) => {
                e.currentTarget.onerror =
                  null;
                e.currentTarget.src =
                  "/logo.png";
              }}
            />

            {/* Enlarge/Zoom Badge Indicator */}
            <button
              type="button"
              onClick={() =>
                setIsModalOpen(
                  true,
                )
              }
              className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-80 group-hover:opacity-100"
              title="Click to Enlarge"
            >
              <Maximize2
                size={
                  18
                }
              />
            </button>

            {/* Left & Right Navigation Arrows */}
            {images.length >
              1 && (
              <>
                <button
                  onClick={(
                    e,
                  ) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  type="button"
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm transition-all border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
                >
                  <ChevronLeft
                    size={
                      22
                    }
                  />
                </button>

                <button
                  onClick={(
                    e,
                  ) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  type="button"
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm transition-all border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95"
                >
                  <ChevronRight
                    size={
                      22
                    }
                  />
                </button>

                {/* Image Counter Badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm select-none">
                  {activeImage +
                    1}{" "}
                  /{" "}
                  {
                    images.length
                  }
                </div>
              </>
            )}
          </div>

          {/* Image & Video Thumbnails Grid */}
          {images.length >
            1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {images.map(
                (
                  img,
                  idx,
                ) => {
                  const thumbUrl =
                    getImageUrl(
                      img,
                    );
                  return (
                    <button
                      key={
                        idx
                      }
                      onClick={() =>
                        setActiveImage(
                          idx,
                        )
                      }
                      className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage ===
                        idx
                          ? "border-blue-600 opacity-100 shadow-md"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={
                          thumbUrl
                        }
                        className="w-full h-full object-cover"
                        alt={`Thumbnail ${idx + 1}`}
                      />
                    </button>
                  );
                },
              )}
            </div>
          )}

          {car.video &&
            car
              .video
              .url && (
              <div className="mt-8 bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-lg">
                <video
                  src={
                    car
                      .video
                      .url
                  }
                  controls
                  controlsList="nodownload"
                  className="w-full max-h-[400px] object-contain"
                  poster={
                    mainImageUrl
                  }
                />
              </div>
            )}
        </div>

        {/* Right Column: ALL Details, Specs, Features & Actions */}
        <div className="flex flex-col space-y-6">
          {/* Desktop Only Header */}
          <div className="hidden lg:block mb-4">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              {
                car.title
              }{" "}
              <span className="text-2xl text-slate-500 font-bold tracking-tight">
                in{" "}
                {car.location ||
                  "Lagos"}

                ,
                Nigeria
              </span>
            </h1>

            {/* Tags Container: Placed BELOW the title */}
            <div className="flex flex-wrap gap-2 mb-4">
              {car.category && (
                <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {
                    car.category
                  }
                </span>
              )}
              {car.condition && (
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {
                    car.condition
                  }
                </span>
              )}
              {car.bodyType && (
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {
                    car.bodyType
                  }
                </span>
              )}
              {isNegotiable && (
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Negotiable
                </span>
              )}
            </div>

            {/* Price */}
            <p className="text-3xl font-black text-blue-600">
              ₦
              {car.priceNGN
                ? Number(
                    car.priceNGN,
                  ).toLocaleString()
                : "Contact for price"}
            </p>
          </div>

          {/* Complete Specifications Grid */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">
              Vehicle
              Details
              &
              Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Make
                </p>
                <p className="font-bold text-slate-900">
                  {car.make ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Model
                </p>
                <p className="font-bold text-slate-900">
                  {car.model ||
                    "N/A"}
                </p>
              </div>
              {car.trim && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Trim
                  </p>
                  <p className="font-bold text-slate-900">
                    {
                      car.trim
                    }
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Year
                </p>
                <p className="font-bold text-slate-900">
                  {car.year ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Condition
                </p>
                <p className="font-bold text-slate-900">
                  {car.condition ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Body
                  Type
                </p>
                <p className="font-bold text-slate-900">
                  {car.bodyType ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Mileage
                </p>
                <p className="font-bold text-slate-900">
                  {car
                    .specs
                    ?.mileage
                    ? `${Number(car.specs.mileage).toLocaleString()} mi`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Transmission
                </p>
                <p className="font-bold text-slate-900">
                  {car
                    .specs
                    ?.transmission ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Engine
                </p>
                <p className="font-bold text-slate-900">
                  {car
                    .specs
                    ?.engineType ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                  Exterior
                  Color
                </p>
                <p className="font-bold text-slate-900">
                  {car
                    .specs
                    ?.exteriorColor ||
                    "N/A"}
                </p>
              </div>
              {car
                .specs
                ?.interiorColor && (
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    Interior
                    Color
                  </p>
                  <p className="font-bold text-slate-900">
                    {
                      car
                        .specs
                        .interiorColor
                    }
                  </p>
                </div>
              )}
              {car
                .specs
                ?.vin && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">
                    VIN
                  </p>
                  <p className="font-bold text-slate-900 font-mono text-sm tracking-wider">
                    {
                      car
                        .specs
                        .vin
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Key Features Section (Moved to Right Side) */}
          {car.features &&
            car
              .features
              .length >
              0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  Key
                  Features
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {car.features.map(
                    (
                      feature,
                      idx,
                    ) => (
                      <li
                        key={
                          idx
                        }
                        className="flex items-center gap-2 text-slate-600 text-sm font-medium"
                      >
                        <CheckCircle2
                          size={
                            16
                          }
                          className="text-emerald-500 flex-shrink-0"
                        />
                        {
                          feature
                        }
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

          {/* Cost Breakdown */}
          <div>
            <CostCalculator
              carPriceNGN={
                Number(
                  car.priceNGN,
                ) ||
                0
              }
              isNegotiable={
                isNegotiable
              }
            />
          </div>

          {/* Contact Actions */}
          <div className="mt-auto flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={
                handleWhatsApp
              }
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <MessageCircle
                size={
                  20
                }
              />
              Request
              via
              WhatsApp
            </button>

            <a
              href={`mailto:${dealerEmail}?subject=Inquiry: ${encodeURIComponent(
                car.title ||
                  "Vehicle",
              )}&body=${encodeURIComponent(emailBody)}`}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-md text-center"
            >
              <Mail
                size={
                  20
                }
              />
              Request
              via
              Email
            </a>
          </div>
        </div>
      </div>
      {/* Enlarged Image Lightbox Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() =>
            setIsModalOpen(
              false,
            )
          }
        >
          {/* Close Button */}
          <button
            onClick={() =>
              setIsModalOpen(
                false,
              )
            }
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full backdrop-blur-sm transition-all z-10"
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
                mainImageUrl
              }
              alt={
                car.title ||
                "Enlarged vehicle view"
              }
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
            />

            {/* Modal Left & Right Navigation Controls */}
            {images.length >
              1 && (
              <>
                <button
                  onClick={(
                    e,
                  ) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-white/20 transition-all backdrop-blur-sm active:scale-95"
                  aria-label="Previous image"
                >
                  <ChevronLeft
                    size={
                      28
                    }
                  />
                </button>

                <button
                  onClick={(
                    e,
                  ) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-3 rounded-full border border-white/20 transition-all backdrop-blur-sm active:scale-95"
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
                  {activeImage +
                    1}{" "}
                  of{" "}
                  {
                    images.length
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
