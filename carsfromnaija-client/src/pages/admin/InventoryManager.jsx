import {
  useState,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
} from "lucide-react";
import API from "../../api/axios";

export default function InventoryManager() {
  const [
    cars,
    setCars,
  ] =
    useState(
      [],
    );
  const [
    search,
    setSearch,
  ] =
    useState(
      "",
    );
  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars =
    async () => {
      try {
        const response =
          await API.get(
            "/cars",
          );
        setCars(
          response.data,
        );
      } catch (error) {
        console.error(
          "Failed to fetch cars:",
          error,
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  const handleDelete =
    async (
      id,
    ) => {
      if (
        window.confirm(
          "Are you sure you want to delete this listing permanently?",
        )
      ) {
        try {
          await API.delete(
            `/cars/${id}`,
          );
          setCars(
            cars.filter(
              (
                car,
              ) =>
                car._id !==
                id,
            ),
          );
        } catch (error) {
          console.error(
            "Failed to delete car:",
            error,
          );
          alert(
            "Could not delete vehicle.",
          );
        }
      }
    };

  const filteredCars =
    cars.filter(
      (
        car,
      ) =>
        car.title
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ) ||
        car.make
          .toLowerCase()
          .includes(
            search.toLowerCase(),
          ),
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Inventory
            Management
          </h1>
          <p className="text-slate-500">
            Manage
            active
            vehicles,
            edit
            listings,
            or
            change
            visibility.
          </p>
        </div>
        <Link
          to="/admin/add-car"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-colors w-max"
        >
          <Plus
            size={
              18
            }
          />{" "}
          Add
          New
          Car
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search
            size={
              18
            }
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search active inventory by make, model, or title..."
            value={
              search
            }
            onChange={(
              e,
            ) =>
              setSearch(
                e
                  .target
                  .value,
              )
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">
            Loading
            inventory...
          </div>
        ) : filteredCars.length ===
          0 ? (
          <div className="p-8 text-center text-slate-500">
            No
            vehicles
            found.
            Add
            one
            above!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4">
                    Vehicle
                  </th>
                  <th className="p-4">
                    Price
                    (USD)
                  </th>
                  <th className="p-4">
                    Price
                    (NGN)
                  </th>
                  <th className="p-4">
                    Status
                  </th>
                  <th className="p-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCars.map(
                  (
                    car,
                  ) => (
                    <tr
                      key={
                        car._id
                      }
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={
                            car
                              .images?.[0]
                              ?.url ||
                            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=150&q=80"
                          }
                          alt={
                            car.title
                          }
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {
                              car.title
                            }
                          </p>
                          <p className="text-xs text-slate-500">
                            {car.specs?.mileage?.toLocaleString()}{" "}
                            miles
                            •{" "}
                            {
                              car
                                .specs
                                ?.transmission
                            }
                          </p>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">
                        $
                        {car.priceUSD?.toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        ₦
                        {car.priceNGN?.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                          {
                            car.status
                          }
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/car/${car._id}`}
                          className="inline-flex p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                        >
                          <Eye
                            size={
                              18
                            }
                          />
                        </Link>
                        <Link
                          to={`/admin/edit-car/${car._id}`}
                          className="inline-flex p-2 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-slate-100"
                        >
                          <Edit3
                            size={
                              18
                            }
                          />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(
                              car._id,
                            )
                          }
                          className="inline-flex p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100"
                        >
                          <Trash2
                            size={
                              18
                            }
                          />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
