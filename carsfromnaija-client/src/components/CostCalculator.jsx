export default function CostCalculator({
  carPriceNGN = 0,
  isNegotiable = false,
}) {
  // Normalize prop to handle strict boolean true/false as well as string "true"/"false"
  const showNegotiable = isNegotiable === true || isNegotiable === "true";

  const totalPriceNGN = Number(carPriceNGN) || 0;
  const shippingAndClearingCost = totalPriceNGN * 0.25;
  const vehicleBuyPrice = totalPriceNGN - shippingAndClearingCost;

  const priceLabel = showNegotiable
    ? "Total Asking Price"
    : "Total Selling Price";

  return (
    <div className="bg-purple-950 text-white p-6 rounded-2xl shadow-lg space-y-4 border border-purple-900">
      <div className="flex justify-between items-center border-b border-purple-800 pb-3">
        <h3 className="text-lg font-bold text-purple-400">
          Cost Breakdown
        </h3>
        {showNegotiable && (
          <span className="bg-blue-900/80 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-700">
            Negotiable
          </span>
        )}
      </div>

      <div className="space-y-3 text-sm pt-1">
        <div className="flex justify-between items-center">
          <span className="text-slate-300">
            Purchase Price:
          </span>
          <span className="font-semibold text-white">
            ₦{vehicleBuyPrice.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-300">
            Shipping & Clearing Fees:
          </span>
          <span className="font-semibold text-white">
            ₦{shippingAndClearingCost.toLocaleString()}
          </span>
        </div>

        <div className="border-t border-purple-800/80 pt-3 flex justify-between items-center font-bold text-lg text-emerald-400">
          <span>
            {priceLabel}:
          </span>
          <span>
            ₦{totalPriceNGN.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mt-3">
        * Price covers complete vehicle sourcing, international shipping, and Lagos port clearance.
      </p>
    </div>
  );
}