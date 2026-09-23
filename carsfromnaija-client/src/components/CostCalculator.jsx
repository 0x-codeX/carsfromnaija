export default function CostCalculator({
  carPriceNGN,
}) {
  // Ensure the value is a number
  const totalPriceNGN =
    Number(
      carPriceNGN,
    ) ||
    0;

  // Calculate 25% for shipping and clearing
  const shippingAndClearingCost =
    totalPriceNGN *
    0.25;

  // The remainder (75%) is the vehicle purchase price
  const vehicleBuyPrice =
    totalPriceNGN -
    shippingAndClearingCost;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-blue-400">
        Cost
        Breakdown
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">
            Purchase
            Price:
          </span>
          <span className="font-medium">
            ₦
            {vehicleBuyPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">
            Est.
            Shipping
            &
            Clearing:
          </span>
          <span className="font-medium">
            ₦
            {shippingAndClearingCost.toLocaleString()}
          </span>
        </div>
        <div className="border-t border-slate-700 pt-3 flex justify-between items-center font-bold text-lg text-emerald-400">
          <span>
            Total
            Price:
          </span>
          <span>
            ₦
            {totalPriceNGN.toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 italic leading-relaxed mt-4">
        *
        Note that price could differ slightly please contact us for the exact price.
      </p>
    </div>
  );
}
