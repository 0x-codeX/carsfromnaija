export default function CostCalculator({
  carPriceUSD,
  settings,
}) {
  const {
    exchangeRateUSDToNGN,
    standardShippingUSD,
    standardClearingNGN,
  } =
    settings;

  const basePriceNGN =
    carPriceUSD *
    exchangeRateUSDToNGN;
  const shippingCostNGN =
    standardShippingUSD *
    exchangeRateUSDToNGN;
  const totalLandedCostNGN =
    basePriceNGN +
    shippingCostNGN +
    standardClearingNGN;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
      <h3 className="text-lg font-bold text-blue-400">
        Estimated
        Total
        Landed
        Cost
      </h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">
            Vehicle
            Buy
            Price
            ($
            {carPriceUSD.toLocaleString()}
            ):
          </span>
          <span className="font-medium">
            ₦
            {basePriceNGN.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">
            Est.
            Shipping
            ($
            {standardShippingUSD.toLocaleString()}
            ):
          </span>
          <span className="font-medium">
            ₦
            {shippingCostNGN.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">
            Est.
            Customs
            Duty
            &
            Clearing:
          </span>
          <span className="font-medium">
            ₦
            {standardClearingNGN.toLocaleString()}
          </span>
        </div>
        <div className="border-t border-slate-700 pt-3 flex justify-between items-center font-bold text-lg text-emerald-400">
          <span>
            Total
            Estimate:
          </span>
          <span>
            ₦
            {totalLandedCostNGN.toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 italic leading-relaxed mt-4">
        *
        Note:
        This
        is
        an
        estimate
        based
        on
        current
        FX
        rates
        ($1
        =
        ₦
        {
          exchangeRateUSDToNGN
        }
        )
        and
        standard
        clearance
        fees.
        Actual
        landed
        cost
        may
        vary.
      </p>
    </div>
  );
}
