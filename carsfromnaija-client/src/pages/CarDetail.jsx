import {
  useState,
  useEffect,
} from "react";
import {
  useParams,
  Link,
} from "react-router-dom";
import {
  CheckCircle2,
  MessageCircle,
  Mail,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import CostCalculator from "../components/CostCalculator";
import API from "../api/axios";

export default function CarDetail() {
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/inventory"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors"
        >
          <ArrowLeft
            size={
              16
            }
          />
          Back
          to
          Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Media Only */}
        <div className="space-y-6">
          {/* Mobile Only: Vehicle Title & Status at top of Image */}
          <div className="block lg:hidden mb-2">
            <div className="flex gap-2 mb-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <span className="flex-shrink-0 whitespace-nowrap bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {car.status ||
                  "Available"}
              </span>

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
              {car.isNegotiable && (
                <span className="flex-shrink-0 whitespace-nowrap bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Negotiable
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
              {
                car.title
              }
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
          <div className="bg-slate-100 rounded-2xl overflow-hidden h-80 md:h-96 border border-slate-200">
            <img
              src={
                mainImageUrl
              }
              alt={
                car.title ||
                "Vehicle display"
              }
              className="w-full h-full object-cover"
              onError={(
                e,
              ) => {
                e.currentTarget.onerror =
                  null;
                e.currentTarget.src =
                  "/logo.png";
              }}
            />
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
          <div className="hidden lg:block">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {car.status ||
                  "Available"}
              </span>
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
              {car.isNegotiable && (
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Negotiable
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
              {
                car.title
              }
            </h1>

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
                  Color
                </p>
                <p className="font-bold text-slate-900">
                  {car
                    .specs
                    ?.color ||
                    "N/A"}
                </p>
              </div>
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

          {/* Cost Calculator */}
          <div>
            <CostCalculator
              carPriceNGN={
                Number(
                  car.priceNGN,
                ) ||
                0
              }
              settings={
                settings
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
    </div>
  );
}
