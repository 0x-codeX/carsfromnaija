import {
  useState,
  useEffect,
} from "react";

export default function CostCalculator({
  carPriceNGN = 0,
}) {
  const [
    inputVal,
    setInputVal,
  ] =
    useState(
      "",
    );

  useEffect(() => {
    if (
      carPriceNGN
    ) {
      setInputVal(
        Number(
          carPriceNGN,
        ).toLocaleString(),
      );
    }
  }, [
    carPriceNGN,
  ]);

  // Parse input handling commas or shorthand (e.g., 15m)
  const parseAmount =
    (
      val,
    ) => {
      if (
        !val
      )
        return 0;
      const clean =
        val
          .toString()
          .trim()
          .toLowerCase()
          .replace(
            /,/g,
            "",
          );
      if (
        /^\d+(\.\d+)?m$/.test(
          clean,
        )
      )
        return (
          parseFloat(
            clean,
          ) *
          1000000
        );
      if (
        /^\d+(\.\d+)?k$/.test(
          clean,
        )
      )
        return (
          parseFloat(
            clean,
          ) *
          1000
        );
      const num =
        Number(
          clean,
        );
      if (
        !isNaN(
          num,
        ) &&
        num >
          0
      ) {
        return num <=
          200
          ? num *
              1000000
          : num;
      }
      return 0;
    };

  const totalPriceNGN =
    parseAmount(
      inputVal,
    );
  const shippingAndClearingCost =
    totalPriceNGN *
    0.25;
  const vehicleBuyPrice =
    totalPriceNGN -
    shippingAndClearingCost;

  return (
    <div className="bg-purple-950 text-white p-6 rounded-2xl shadow-lg space-y-4 border border-purple-900">
      <div className="flex justify-between items-center border-b border-purple-800 pb-3">
        <h3 className="text-lg font-bold text-purple-400">
          Interactive
          Cost
          Breakdown
        </h3>
      </div>

      <div className="space-y-2">
        <label className="block text-xs text-purple-300 font-semibold uppercase tracking-wider">
          Enter
          Total
          Budget
          /
          Vehicle
          Price
          (₦)
        </label>
        <input
          type="text"
          value={
            inputVal
          }
          onChange={(
            e,
          ) =>
            setInputVal(
              e
                .target
                .value,
            )
          }
          placeholder="e.g. 15,000,000 or 15m"
          className="w-full bg-purple-900/60 border border-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
        />
      </div>

      <div className="space-y-3 text-sm pt-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">
            Est.
            Purchase
            Price
            (75%):
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
            Clearing
            (25%):
          </span>
          <span className="font-medium">
            ₦
            {shippingAndClearingCost.toLocaleString()}
          </span>
        </div>
        <div className="border-t border-slate-700 pt-3 flex justify-between items-center font-bold text-lg text-emerald-400">
          <span>
            Total
            Estimated
            Price:
          </span>
          <span>
            ₦
            {totalPriceNGN.toLocaleString()}
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-400 italic leading-relaxed mt-4">
        *
        Estimates
        are
        based
        on
        standard
        shipping
        &
        port
        clearing
        tariffs
        in
        Lagos,
        Nigeria.
        Contact
        us
        for
        precise
        landing
        quotes.
      </p>
    </div>
  );
}
