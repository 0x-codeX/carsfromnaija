import {
  useState,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Tag,
} from "lucide-react";
import API from "../api/axios";

export default function RecentSales() {
  const [
    recentSales,
    setRecentSales,
  ] =
    useState(
      [],
    );
  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  useEffect(() => {
    const fetchRecentSales =
      async () => {
        try {
          // Fetch real data from the backend endpoint you just created
          const response =
            await API.get(
              "/recent-sales",
            );
          setRecentSales(
            response.data ||
              [],
          );
        } catch (error) {
          console.error(
            "Failed to fetch recent sales",
            error,
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    fetchRecentSales();
  }, []);

  // Determines if this is the newest sale (index 0) AND occurred within the last 14 days
  const isLatestSale =
    (
      sale,
      index,
    ) => {
      if (
        index !==
        0
      )
        return false;
      if (
        !sale.soldAt
      )
        return true; // Fallback if no date exists

      const saleDate =
        new Date(
          sale.soldAt,
        ).getTime();
      const now =
        new Date().getTime();
      const fourteenDaysInMs =
        14 *
        24 *
        60 *
        60 *
        1000;

      return (
        now -
          saleDate <=
        fourteenDaysInMs
      );
    };

  // Do not render the section at all if there is no data
  if (
    !loading &&
    recentSales.length ===
      0
  ) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Recent
            Sales
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Recently
            acquired
            and
            delivered
            to
            happy
            clients
            in
            Nigeria.
          </p>
        </div>
        <Link
          to="/inventory"
          className="text-blue-600 font-semibold hover:underline text-sm"
        >
          Browse
          Available
          Inventory
          &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentSales.map(
            (
              sale,
              index,
            ) => (
              <div
                key={
                  sale._id ||
                  index
                }
                className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group hover:shadow-md transition-shadow"
              >
                {/* Image Section */}
                <div className="relative h-60 bg-slate-200 overflow-hidden">
                  <img
                    src={
                      sale.image ||
                      "https://via.placeholder.com/600x400?text=Sold+Car"
                    }
                    alt={
                      sale.title
                    }
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Dark gradient overlay for visual contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* SOLD Label on the Left */}
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <CheckCircle
                      size={
                        14
                      }
                    />
                    SOLD
                  </div>

                  {/* LATEST SALE Ribbon on the Right */}
                  {isLatestSale(
                    sale,
                    index,
                  ) && (
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Tag
                        size={
                          14
                        }
                      />
                      Latest
                      Sale
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col justify-between">
                  <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-1">
                    {
                      sale.title
                    }
                  </h3>

                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase mb-1">
                        Final
                        Price
                      </p>
                      <p className="text-emerald-700 font-black text-xl">
                        ₦
                        {Number(
                          sale.priceNGN ||
                            0,
                        ).toLocaleString()}
                      </p>
                    </div>

                    {sale.soldAt && (
                      <p className="text-xs text-slate-400 font-medium pb-1">
                        {new Date(
                          sale.soldAt,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
