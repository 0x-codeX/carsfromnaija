import { Link } from "react-router-dom";
import {
  Gauge,
  Fuel,
  Cog,
} from "lucide-react";

export default function CarCard({
  car,
}) {
  const isSold =
    car.status ===
    "sold";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-200 flex flex-col">
      {/* Image & Status Badge Container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={
            car.mainImage ||
            (typeof car
              .images?.[0] ===
            "string"
              ? car
                  .images[0]
              : car
                  .images?.[0]
                  ?.url) ||
            "/logo.png"
          }
          alt={
            car.title
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
        <div className="absolute top-3 left-3 flex gap-2">
          {isSold ? (
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Sold
            </span>
          ) : (
            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Available
            </span>
          )}
          {car.isNegotiable &&
            !isSold && (
              <span className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Negotiable
              </span>
            )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
            {
              car.title
            }
          </h3>
          <p className="text-2xl font-black text-blue-600 mt-1">
            ₦
            {(isSold &&
            car.soldPriceNGN
              ? car.soldPriceNGN
              : car.priceNGN
            ).toLocaleString()}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-slate-100 text-slate-600 text-xs">
            <div className="flex items-center gap-1.5">
              <Gauge
                size={
                  14
                }
                className="text-slate-400"
              />
              <span>
                {car.specs?.mileage?.toLocaleString()}{" "}
                mi
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog
                size={
                  14
                }
                className="text-slate-400"
              />
              <span>
                {car
                  .specs
                  ?.transmission ||
                  "Auto"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel
                size={
                  14
                }
                className="text-slate-400"
              />
              <span>
                {car
                  .specs
                  ?.engineType ||
                  "V6"}
              </span>
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={`/car/${car._id}`}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white text-center font-semibold py-2.5 rounded-lg text-sm transition-colors block"
        >
          View
          Details
        </Link>
      </div>
    </div>
  );
}
