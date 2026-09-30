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
  X,
  CheckCircle,
} from "lucide-react";
import API from "../../api/axios";
import { Helmet } from "react-helmet-async";


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
  // In-App Notification State
  const [
    feedback,
    setFeedback,
  ] =
    useState(
      null,
    );

  // Custom Delete Confirmation Modal State
  const [
    deleteCarId,
    setDeleteCarId,
  ] =
    useState(
      null,
    );
  const [
    isDeleting,
    setIsDeleting,
  ] =
    useState(
      false,
    );

  // Auto-dismissing feedback banner helper
  const showFeedback =
    (
      type,
      message,
    ) => {
      setFeedback(
        {
          type,
          message,
        },
      );
      setTimeout(
        () =>
          setFeedback(
            null,
          ),
        4000,
      );
    };

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

  const confirmDelete =
    async () => {
      if (
        !deleteCarId
      )
        return;
      try {
        setIsDeleting(
          true,
        );
        await API.delete(
          `/cars/${deleteCarId}`,
        );
        setCars(
          cars.filter(
            (
              car,
            ) =>
              car._id !==
              deleteCarId,
          ),
        );
        showFeedback(
          "success",
          "Vehicle permanently deleted.",
        );
        setDeleteCarId(
          null,
        ); // Close modal
      } catch (error) {
        console.error(
          "Failed to delete car:",
          error,
        );
        showFeedback(
          "error",
          "Could not delete vehicle.",
        );
      } finally {
        setIsDeleting(
          false,
        );
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
      {/* Helmet for Page Title */}
      <Helmet>
        <title>
          Inventory
          |
          CarsFromNaija
          Admin
        </title>
        <meta
          name="description"
          content="Manage your active vehicle inventory."
        />
      </Helmet>

      {/* In-App Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
            feedback.type ===
            "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            {feedback.type ===
            "success" ? (
              <CheckCircle
                size={
                  18
                }
                className="text-emerald-600"
              />
            ) : (
              <AlertCircle
                size={
                  18
                }
                className="text-red-600"
              />
            )}
            <span>
              {
                feedback.message
              }
            </span>
          </div>
          <button
            onClick={() =>
              setFeedback(
                null,
              )
            }
            className="text-slate-400 hover:text-slate-600"
          >
            <X
              size={
                18
              }
            />
          </button>
        </div>
      )}
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
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
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
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
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
                          state={{
                            fromAdmin: true,
                          }}
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
                            setDeleteCarId(
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
      {/* DELETE CONFIRMATION MODAL */}
      {deleteCarId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setDeleteCarId(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              Delete Vehicle
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Are you sure you want to delete this listing permanently? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteCarId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
