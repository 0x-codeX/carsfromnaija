import {
  useState,
  useEffect,
} from "react";
import BudgetFinder from "../components/BudgetFinder";
import RecentSales from "../components/RecentSales";
import API from "../api/axios";

// Carousel Images - Ensure you host high-res, compressed webp versions of these to save mobile data
const HERO_CAROUSEL =
  [
    "https://images.unsplash.com/photo-1645145214095-84fca73e0cc5?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1920&auto=format&fit=crop", // Luxury SUV
    "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1920&auto=format&fit=crop", // Sport Sedan
    "https://images.unsplash.com/photo-1577615765564-4ee327d3fc49?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=1920&auto=format&fit=crop", // Red Mercedes
  ];

export default function Home() {
  const [
    settings,
    setSettings,
  ] =
    useState(
      {
        dealerPhoneWhatsApp:
          "2348000000000",
        priceGuides:
          [],
      },
    );

  const [
    currentSlide,
    setCurrentSlide,
  ] =
    useState(
      0,
    );

  // Fetch Settings
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
            setSettings(
              {
                dealerPhoneWhatsApp:
                  response
                    .data
                    .dealerPhoneWhatsApp ||
                  "2348000000000",
                priceGuides:
                  response
                    .data
                    .priceGuides ||
                  [],
              },
            );
          }
        } catch (error) {
          console.error(
            "Failed to load settings:",
            error,
          );
        }
      };
    fetchSettings();
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
      ); // Rotate every 5 seconds
    return () =>
      clearInterval(
        timer,
      );
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative min-h-[600px] lg:h-[80vh] w-full flex items-center justify-center overflow-hidden pt-20 lg:pt-0">
        {/* Carousel Background Images */}
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
              {/* Dark overlay to ensure text and widget are readable */}
              <div className="absolute inset-0 bg-slate-950/70"></div>
            </div>
          ),
        )}

        {/* Foreground Layout */}
        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
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
            />
          </div>
        </div>
      </section>

      {/* Recent Sales Section */}
      <div className="relative z-0">
        <RecentSales />
      </div>
    </div>
  );
}
