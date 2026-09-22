import {
  useState,
  useEffect,
} from "react";
import {
  Car,
  CheckCircle,
  Users,
  MessageCircle,
  Mail,
  Plus,
  Trash2,
  Tag,
  X,
  AlertCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import API from "../../api/axios";

export default function Dashboard() {
  const [
    cars,
    setCars,
  ] =
    useState(
      [],
    );
  const [
    inquiries,
    setInquiries,
  ] =
    useState(
      [],
    );
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
  const [
    error,
    setError,
  ] =
    useState(
      null,
    );

  // Modal States
  const [
    soldModalCar,
    setSoldModalCar,
  ] =
    useState(
      null,
    );
  const [
    soldPriceInput,
    setSoldPriceInput,
  ] =
    useState(
      "",
    );
  const [
    isSubmittingSale,
    setIsSubmittingSale,
  ] =
    useState(
      false,
    );

  const [
    isAddSaleModalOpen,
    setIsAddSaleModalOpen,
  ] =
    useState(
      false,
    );
  const [
    manualSaleForm,
    setManualSaleForm,
  ] =
    useState(
      {
        title:
          "",
        priceNGN:
          "",
        image:
          "",
      },
    );

  // Fetch Dashboard Data Concurrent Requests
  const fetchDashboardData =
    async () => {
      try {
        setLoading(
          true,
        );
        setError(
          null,
        );

        const [
          carsRes,
          inquiriesRes,
          salesRes,
        ] =
          await Promise.all(
            [
              API.get(
                "/cars",
              ).catch(
                () => ({
                  data: [],
                }),
              ),
              API.get(
                "/inquiries",
              ).catch(
                () => ({
                  data: [],
                }),
              ),
              API.get(
                "/recent-sales",
              ).catch(
                () => ({
                  data: [],
                }),
              ),
            ],
          );

        setCars(
          carsRes.data ||
            [],
        );
        setInquiries(
          inquiriesRes.data ||
            [],
        );
        // Maintain max 3 recent sales
        setRecentSales(
          (
            salesRes.data ||
            []
          ).slice(
            0,
            3,
          ),
        );
      } catch (err) {
        console.error(
          "Dashboard data sync error:",
          err,
        );
        setError(
          "Failed to sync dashboard data with server.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Mark as Sold Submission
  const handleConfirmSold =
    async (
      e,
    ) => {
      e.preventDefault();
      if (
        !soldModalCar ||
        !soldPriceInput
      )
        return;

      try {
        setIsSubmittingSale(
          true,
        );

        const imageUrl =
          soldModalCar.images &&
          soldModalCar
            .images
            .length >
            0
            ? typeof soldModalCar
                .images[0] ===
              "string"
              ? soldModalCar
                  .images[0]
              : soldModalCar
                  .images[0]
                  .url
            : "https://via.placeholder.com/400x300?text=Vehicle+Sold";

        // 1. Post to Recent Sales API
        const newSalePayload =
          {
            title:
              soldModalCar.title,
            priceNGN:
              Number(
                soldPriceInput,
              ),
            image:
              imageUrl,
            soldAt:
              new Date().toISOString(),
          };

        await API.post(
          "/recent-sales",
          newSalePayload,
        );

        // 2. Delete/Remove from Active Inventory
        await API.delete(
          `/cars/${soldModalCar._id}`,
        );

        // Reset Modal and Refresh
        setSoldModalCar(
          null,
        );
        setSoldPriceInput(
          "",
        );
        await fetchDashboardData();
      } catch (err) {
        console.error(
          "Failed to mark car as sold:",
          err,
        );
        alert(
          "Error marking car as sold. Please try again.",
        );
      } finally {
        setIsSubmittingSale(
          false,
        );
      }
    };

  // Handle Manual Recent Sale Creation
  const handleAddManualSale =
    async (
      e,
    ) => {
      e.preventDefault();
      if (
        !manualSaleForm.title ||
        !manualSaleForm.priceNGN
      )
        return;

      try {
        setIsSubmittingSale(
          true,
        );

        const payload =
          {
            title:
              manualSaleForm.title,
            priceNGN:
              Number(
                manualSaleForm.priceNGN,
              ),
            image:
              manualSaleForm.image ||
              "https://via.placeholder.com/400x300?text=Vehicle+Sold",
            soldAt:
              new Date().toISOString(),
          };

        await API.post(
          "/recent-sales",
          payload,
        );

        setManualSaleForm(
          {
            title:
              "",
            priceNGN:
              "",
            image:
              "",
          },
        );
        setIsAddSaleModalOpen(
          false,
        );
        await fetchDashboardData();
      } catch (err) {
        console.error(
          "Failed to add recent sale:",
          err,
        );
        alert(
          "Error adding recent sale. Please try again.",
        );
      } finally {
        setIsSubmittingSale(
          false,
        );
      }
    };

  // Handle Delete Recent Sale item
  const handleDeleteSale =
    async (
      saleId,
    ) => {
      if (
        !window.confirm(
          "Remove this car from Recent Sales showcase?",
        )
      )
        return;
      try {
        await API.delete(
          `/recent-sales/${saleId}`,
        );
        await fetchDashboardData();
      } catch (err) {
        console.error(
          "Failed to delete recent sale:",
          err,
        );
      }
    };

  // Check if a sale qualifies for the "Latest Sale" badge (Index 0 & within 14 days)
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
        return true; // Default fallback if no date provided

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

  const handleWhatsAppReply =
    (
      inquiry,
    ) => {
      const text = `Hello ${inquiry.customerName}, reaching out from CarsFromNaija regarding your request for a ${inquiry.preferredCategory || "vehicle"}.`;
      window.open(
        `https://wa.me/${inquiry.phoneNumber}?text=${encodeURIComponent(text)}`,
        "_blank",
      );
    };

  if (
    loading
  ) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-slate-500 font-semibold gap-3">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p>
          Syncing
          dashboard
          statistics...
        </p>
      </div>
    );
  }

  const pendingInquiriesCount =
    inquiries.filter(
      (
        i,
      ) =>
        i.status ===
        "Pending",
    ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Dashboard
          Overview
        </h1>
        <p className="text-slate-500">
          Manage
          active
          inventory,
          sales
          showcases,
          and
          customer
          requests.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle
            size={
              20
            }
          />
          <p className="text-sm font-semibold">
            {
              error
            }
          </p>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600 w-fit mb-4">
            <Car
              size={
                24
              }
            />
          </div>
          <p className="text-slate-500 text-sm font-semibold">
            Active
            Inventory
          </p>
          <h3 className="text-3xl font-black text-slate-900">
            {
              cars.length
            }
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 w-fit mb-4">
            <CheckCircle
              size={
                24
              }
            />
          </div>
          <p className="text-slate-500 text-sm font-semibold">
            Recent
            Sales
            Showcase
          </p>
          <h3 className="text-3xl font-black text-slate-900">
            {
              recentSales.length
            }{" "}
            /
            3
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-purple-100 p-3 rounded-lg text-purple-600 w-fit mb-4">
            <Users
              size={
                24
              }
            />
          </div>
          <p className="text-slate-500 text-sm font-semibold">
            Total
            Inquiries
          </p>
          <h3 className="text-3xl font-black text-slate-900">
            {
              inquiries.length
            }
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-amber-100 p-3 rounded-lg text-amber-600 w-fit mb-4">
            <MessageCircle
              size={
                24
              }
            />
          </div>
          <p className="text-slate-500 text-sm font-semibold">
            Pending
            Requests
          </p>
          <h3 className="text-3xl font-black text-slate-900">
            {
              pendingInquiriesCount
            }
          </h3>
        </div>
      </div>

      {/* RECENT SALES SHOWCASE (Max 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp
                className="text-emerald-600"
                size={
                  20
                }
              />
              Recent
              Sales
              Showcase
              (Max
              3)
            </h2>
            <p className="text-xs text-slate-500">
              Displayed
              prominently
              on
              the
              Homepage.
              Automatically
              tags
              the
              newest
              sale
              as
              "Latest
              Sale".
            </p>
          </div>
          {recentSales.length <
            3 && (
            <button
              onClick={() =>
                setIsAddSaleModalOpen(
                  true,
                )
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus
                size={
                  16
                }
              />
              Add
              Recent
              Sale
            </button>
          )}
        </div>

        <div className="p-6">
          {recentSales.length ===
          0 ? (
            <p className="text-slate-400 text-sm italic text-center py-4">
              No
              recent
              sales
              recorded
              yet.
              Mark
              an
              inventory
              car
              as
              sold
              or
              add
              one
              manually.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSales.map(
                (
                  sale,
                  idx,
                ) => (
                  <div
                    key={
                      sale._id ||
                      idx
                    }
                    className="relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex flex-col"
                  >
                    {/* Image & Badge */}
                    <div className="h-40 relative bg-slate-200">
                      <img
                        src={
                          sale.image ||
                          "https://via.placeholder.com/400x300?text=Sold+Car"
                        }
                        alt={
                          sale.title
                        }
                        className="w-full h-full object-cover"
                      />
                      {isLatestSale(
                        sale,
                        idx,
                      ) && (
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Tag
                            size={
                              12
                            }
                          />
                          Latest
                          Sale
                        </span>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteSale(
                            sale._id,
                          )
                        }
                        className="absolute top-3 right-3 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition-colors shadow-md"
                        title="Delete from recent sales"
                      >
                        <Trash2
                          size={
                            14
                          }
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">
                          {
                            sale.title
                          }
                        </h4>
                        <p className="text-emerald-700 font-black text-lg">
                          ₦
                          {Number(
                            sale.priceNGN ||
                              0,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE INVENTORY WITH "MARK AS SOLD" ACTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Active
            Inventory
            Management
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {cars.length ===
          0 ? (
            <p className="p-6 text-slate-400 text-sm italic text-center">
              No
              active
              cars
              in
              inventory.
            </p>
          ) : (
            cars.map(
              (
                car,
              ) => {
                const carImg =
                  car.images &&
                  car
                    .images
                    .length >
                    0
                    ? typeof car
                        .images[0] ===
                      "string"
                      ? car
                          .images[0]
                      : car
                          .images[0]
                          .url
                    : "https://via.placeholder.com/100";

                return (
                  <div
                    key={
                      car._id
                    }
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          carImg
                        }
                        alt={
                          car.title
                        }
                        className="w-16 h-12 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900">
                          {
                            car.title
                          }
                        </h4>
                        <p className="text-xs text-blue-600 font-semibold">
                          Listed
                          Price:
                          ₦
                          {Number(
                            car.priceNGN ||
                              0,
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSoldModalCar(
                          car,
                        );
                        setSoldPriceInput(
                          car.priceNGN ||
                            "",
                        );
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors self-start sm:self-center"
                    >
                      <DollarSign
                        size={
                          14
                        }
                      />
                      Mark
                      as
                      Sold
                    </button>
                  </div>
                );
              },
            )
          )}
        </div>
      </div>

      {/* RECENT BUDGET REQUESTS / INQUIRIES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Recent
            Budget
            Requests
            &
            Inquiries
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {inquiries.length ===
          0 ? (
            <p className="p-6 text-slate-400 text-sm italic text-center">
              No
              inquiries
              received
              yet.
            </p>
          ) : (
            inquiries.map(
              (
                inquiry,
              ) => (
                <div
                  key={
                    inquiry._id
                  }
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-grow">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Customer
                      </p>
                      <p className="font-bold text-slate-900">
                        {inquiry.customerName ||
                          inquiry.name ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Budget
                        (₦)
                      </p>
                      <p className="font-bold text-blue-600">
                        ₦
                        {Number(
                          inquiry.budgetNGN ||
                            0,
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Category
                      </p>
                      <p className="font-semibold text-slate-700">
                        {inquiry.preferredCategory ||
                          "Any"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold">
                        Status
                      </p>
                      <span className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full mt-1">
                        {inquiry.status ||
                          "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0 flex-shrink-0">
                    <button
                      onClick={() =>
                        handleWhatsAppReply(
                          inquiry,
                        )
                      }
                      className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageCircle
                        size={
                          14
                        }
                      />
                      Respond
                    </button>
                    {inquiry.email && (
                      <a
                        href={`mailto:${inquiry.email}?subject=CarsFromNaija Inquiry`}
                        className="flex-1 md:flex-none bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Mail
                          size={
                            14
                          }
                        />
                        Email
                      </a>
                    )}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>

      {/* MODAL 1: MARK AS SOLD INPUT */}
      {soldModalCar && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() =>
                setSoldModalCar(
                  null,
                )
              }
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X
                size={
                  20
                }
              />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Mark
              Vehicle
              as
              Sold
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter
              the
              final
              sale
              price
              for{" "}
              <span className="font-bold text-slate-800">
                {
                  soldModalCar.title
                }
              </span>

              .
              This
              will
              delete
              the
              car
              from
              active
              inventory
              and
              move
              it
              to
              Recent
              Sales.
            </p>

            <form
              onSubmit={
                handleConfirmSold
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Amount
                  Sold
                  (₦)
                </label>
                <input
                  type="number"
                  required
                  value={
                    soldPriceInput
                  }
                  onChange={(
                    e,
                  ) =>
                    setSoldPriceInput(
                      e
                        .target
                        .value,
                    )
                  }
                  placeholder="e.g. 28000000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setSoldModalCar(
                      null,
                    )
                  }
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmittingSale
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                >
                  {isSubmittingSale
                    ? "Processing..."
                    : "Confirm & Move to Sales"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD MANUAL RECENT SALE */}
      {isAddSaleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() =>
                setIsAddSaleModalOpen(
                  false,
                )
              }
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X
                size={
                  20
                }
              />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Add
              Recent
              Sale
              Showcase
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Manually
              add
              a
              sold
              car
              directly
              to
              the
              homepage
              recent
              sales
              section.
            </p>

            <form
              onSubmit={
                handleAddManualSale
              }
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Car
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={
                    manualSaleForm.title
                  }
                  onChange={(
                    e,
                  ) =>
                    setManualSaleForm(
                      {
                        ...manualSaleForm,
                        title:
                          e
                            .target
                            .value,
                      },
                    )
                  }
                  placeholder="e.g. 2022 Toyota Land Cruiser Prado"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Amount
                  Sold
                  (₦)
                </label>
                <input
                  type="number"
                  required
                  value={
                    manualSaleForm.priceNGN
                  }
                  onChange={(
                    e,
                  ) =>
                    setManualSaleForm(
                      {
                        ...manualSaleForm,
                        priceNGN:
                          e
                            .target
                            .value,
                      },
                    )
                  }
                  placeholder="e.g. 45000000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Image
                  URL
                </label>
                <input
                  type="url"
                  value={
                    manualSaleForm.image
                  }
                  onChange={(
                    e,
                  ) =>
                    setManualSaleForm(
                      {
                        ...manualSaleForm,
                        image:
                          e
                            .target
                            .value,
                      },
                    )
                  }
                  placeholder="https://..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setIsAddSaleModalOpen(
                      false,
                    )
                  }
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmittingSale
                  }
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs transition-colors disabled:opacity-50"
                >
                  {isSubmittingSale
                    ? "Saving..."
                    : "Add to Recent Sales"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
