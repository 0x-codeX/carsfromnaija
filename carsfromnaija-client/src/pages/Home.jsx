import {
  useState,
  useEffect,
} from "react";
import BudgetFinder from "../components/BudgetFinder";
import RecentSales from "../components/RecentSales";
import API from "../api/axios";

// Carousel Images
const HERO_CAROUSEL =
  [
    "https://images.unsplash.com/photo-1645145214095-84fca73e0cc5?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1577615765564-4ee327d3fc49?q=80&w=1920&auto=format&fit=crop",
  ];

export default function Home() {
  const [
    settings,
    setSettings,
  ] =
    useState(
      {
        dealerPhoneWhatsApp:
          "+234 805 997 5887",
        priceGuides:
          [],
      },
    );

  const [
    inventory,
    setInventory,
  ] =
    useState(
      [],
    );
  const [
    currentSlide,
    setCurrentSlide,
  ] =
    useState(
      0,
    );

  // Fetch Settings & Available Inventory
  useEffect(() => {
    const fetchData =
      async () => {
        try {
          const [
            settingsRes,
            carsRes,
          ] =
            await Promise.all(
              [
                API.get(
                  "/settings",
                ),
                API.get(
                  "/cars",
                ),
              ],
            );

          if (
            settingsRes.data
          ) {
            setSettings(
              {
                dealerPhoneWhatsApp:
                  settingsRes
                    .data
                    .dealerPhoneWhatsApp ||
                  "+234 805 997 5887",
                priceGuides:
                  settingsRes
                    .data
                    .priceGuides ||
                  [],
              },
            );
          }

          if (
            carsRes.data
          ) {
            // Filter to only pass available cars to the search widget
            setInventory(
              carsRes.data.filter(
                (
                  car,
                ) =>
                  car.status ===
                  "available",
              ),
            );
          }
        } catch (error) {
          console.error(
            "Failed to load data:",
            error,
          );
        }
      };
    fetchData();
  }, []);

  // Auto-Carousel Logic
  useEffect(() => {
    const timer =
      setInterval(
        () => {
          setCurrentSlide(
            (
              prev,
            ) =>
              (prev +
                1) %
              HERO_CAROUSEL.length,
          );
        },
        5000,
      );
    return () =>
      clearInterval(
        timer,
      );
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section - Removed 'overflow-hidden' from the main section so the dropdown isn't clipped */}
      <section className="relative min-h-[600px] lg:h-[80vh] w-full flex items-center justify-center pt-20 lg:pt-0">
        {/* Carousel Background Images wrapped in its own isolated overflow-hidden container */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          {HERO_CAROUSEL.map(
            (
              img,
              index,
            ) => (
              <div
                key={
                  index
                }
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index ===
                  currentSlide
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              >
                <img
                  src={
                    img
                  }
                  alt="Luxury Car"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/70"></div>
              </div>
            ),
          )}
        </div>

        {/* Foreground Layout */}
        <div className="container mx-auto px-4 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Find
              Your
              Dream
              Drive{" "}
              <br />
              <span className="text-blue-500">
                In
                Nigeria
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Your
              trusted
              car
              brokerage
              and
              consultancy.
              We
              source,
              ship,
              clear,
              and
              deliver
              verified
              vehicles
              straight
              to
              you.
            </p>
          </div>

          {/* Right: Compact Budget Finder */}
          <div className="w-full lg:w-[450px] relative">
            <BudgetFinder
              dealerWhatsApp={
                settings.dealerPhoneWhatsApp
              }
              priceGuides={
                settings.priceGuides
              }
              inventory={
                inventory
              }
            />
          </div>
        </div>
      </section>

      {/* Recent Sales Section */}
      <div className="relative z-10">
        <RecentSales />
      </div>
    </div>
  );
}
