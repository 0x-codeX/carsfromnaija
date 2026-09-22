import {
  useState,
  useEffect,
} from "react";
import {
  Save,
  Calculator,
  Phone,
  List,
  Plus,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";
import API from "../../api/axios";

export default function Settings() {
  const [
    settings,
    setSettings,
  ] =
    useState(
      {
        exchangeRateUSDToNGN: 1550,
        standardShippingUSD: 2500,
        standardClearingNGN: 3500000,
        dealerPhoneWhatsApp:
          "2348000000000",
        dealerEmail:
          "sales@carsfromnaija.com",
        priceGuides:
          [],
      },
    );
  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );
  const [
    saving,
    setSaving,
  ] =
    useState(
      false,
    );
  const [
    uploadingIndex,
    setUploadingIndex,
  ] =
    useState(
      null,
    ); // Tracks which row is uploading

  useEffect(() => {
    fetchSettings();
  }, []);

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
              ...response.data,
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
        alert(
          "Error fetching platform settings.",
        );
      } finally {
        setLoading(
          false,
        );
      }
    };

  const handleChange =
    (
      e,
    ) => {
      const {
        name,
        value,
      } =
        e.target;
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          [name]:
            value,
        }),
      );
    };

  const handleAddGuide =
    () => {
      if (
        settings
          .priceGuides
          .length >=
        10
      ) {
        return alert(
          "Maximum limit of 10 price guides reached.",
        );
      }
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          priceGuides:
            [
              ...prev.priceGuides,
              {
                make: "",
                model:
                  "",
                yearStart: 2000,
                yearEnd: 2005,
                priceMinNGN:
                  "",
                priceMaxNGN:
                  "",
                imageUrl:
                  "",
                category:
                  "Regular",
              },
            ],
        }),
      );
    };

  const handleUpdateGuide =
    (
      index,
      field,
      value,
    ) => {
      const updatedGuides =
        [
          ...settings.priceGuides,
        ];
      updatedGuides[
        index
      ][
        field
      ] =
        value;
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          priceGuides:
            updatedGuides,
        }),
      );
    };

  const handleRemoveGuide =
    (
      index,
    ) => {
      const updatedGuides =
        settings.priceGuides.filter(
          (
            _,
            i,
          ) =>
            i !==
            index,
        );
      setSettings(
        (
          prev,
        ) => ({
          ...prev,
          priceGuides:
            updatedGuides,
        }),
      );
    };

  // --- NEW: Handle Instant Image Upload ---
  const handleImageUpload =
    async (
      index,
      file,
    ) => {
      if (
        !file
      )
        return;

      setUploadingIndex(
        index,
      );
      const formData =
        new FormData();
      formData.append(
        "image",
        file,
      );

      try {
        const res =
          await API.post(
            "/upload",
            formData,
            {
              headers:
                {
                  "Content-Type":
                    "multipart/form-data",
                },
            },
          );

        // Instantly inject the returned Cloudinary URL into the input field
        handleUpdateGuide(
          index,
          "imageUrl",
          res
            .data
            .url,
        );
      } catch (error) {
        console.error(
          "Upload failed:",
          error,
        );
        alert(
          "Failed to upload image. Please try again or paste a URL directly.",
        );
      } finally {
        setUploadingIndex(
          null,
        );
      }
    };
  // ----------------------------------------

  const handleSubmit =
    async (
      e,
    ) => {
      e.preventDefault();
      setSaving(
        true,
      );
      try {
        await API.put(
          "/settings",
          settings,
        );
        alert(
          "Global configuration and Price Guides updated successfully!",
        );
      } catch (error) {
        console.error(
          "Failed to save settings:",
          error,
        );
        alert(
          "Failed to save settings.",
        );
      } finally {
        setSaving(
          false,
        );
      }
    };

  if (
    loading
  ) {
    return (
      <div className="p-8 text-center text-slate-500 font-bold">
        Loading
        configurations...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Platform
          Settings
        </h1>
        <p className="text-slate-500">
          Control
          exchange
          rates,
          costs,
          contact
          details,
          and
          search
          fallback
          guides.
        </p>
      </div>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-6"
      >
        {/* Cost Calculator Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Calculator
              size={
                20
              }
              className="text-blue-600"
            />
            <h2 className="text-lg font-bold">
              Pricing
              Engine
              (Cost
              Calculator)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                USD
                to
                NGN
                Exchange
                Rate
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₦
                </span>
                <input
                  type="number"
                  name="exchangeRateUSDToNGN"
                  required
                  value={
                    settings.exchangeRateUSDToNGN
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Standard
                Shipping
                Cost
                (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  name="standardShippingUSD"
                  required
                  value={
                    settings.standardShippingUSD
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Standard
                Clearing
                &
                Duty
                (NGN)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₦
                </span>
                <input
                  type="number"
                  name="standardClearingNGN"
                  required
                  value={
                    settings.standardClearingNGN
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2.5 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Phone
              size={
                20
              }
              className="text-emerald-600"
            />
            <h2 className="text-lg font-bold">
              Contact
              &
              Lead
              Generation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                WhatsApp
                Number
                (Intl
                Format)
              </label>
              <input
                type="text"
                name="dealerPhoneWhatsApp"
                required
                value={
                  settings.dealerPhoneWhatsApp
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Dealer
                Email
              </label>
              <input
                type="email"
                name="dealerEmail"
                required
                value={
                  settings.dealerEmail
                }
                onChange={
                  handleChange
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Market Price Guides Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-slate-900">
              <List
                size={
                  20
                }
                className="text-purple-600"
              />
              <h2 className="text-lg font-bold">
                Market
                Price
                Guides
              </h2>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {
                settings
                  .priceGuides
                  .length
              }{" "}
              /
              10
              Active
            </span>
          </div>

          <div className="space-y-6">
            {settings.priceGuides.map(
              (
                guide,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="grid grid-cols-12 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl relative shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveGuide(
                        index,
                      )
                    }
                    className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-1.5 rounded-full transition-colors shadow-sm"
                  >
                    <Trash2
                      size={
                        16
                      }
                    />
                  </button>

                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Make
                      &
                      Model
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Toyota"
                        required
                        value={
                          guide.make
                        }
                        onChange={(
                          e,
                        ) =>
                          handleUpdateGuide(
                            index,
                            "make",
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Camry"
                        required
                        value={
                          guide.model
                        }
                        onChange={(
                          e,
                        ) =>
                          handleUpdateGuide(
                            index,
                            "model",
                            e
                              .target
                              .value,
                          )
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Year
                      Range
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        required
                        value={
                          guide.yearStart
                        }
                        onChange={(
                          e,
                        ) =>
                          handleUpdateGuide(
                            index,
                            "yearStart",
                            Number(
                              e
                                .target
                                .value,
                            ),
                          )
                        }
                        className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 text-center"
                      />
                      <span className="text-slate-400">
                        -
                      </span>
                      <input
                        type="number"
                        required
                        value={
                          guide.yearEnd
                        }
                        onChange={(
                          e,
                        ) =>
                          handleUpdateGuide(
                            index,
                            "yearEnd",
                            Number(
                              e
                                .target
                                .value,
                            ),
                          )
                        }
                        className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500 text-center"
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price
                      Range
                      (NGN)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        required
                        value={
                          guide.priceMinNGN
                        }
                        onChange={(
                          e,
                        ) =>
                          handleUpdateGuide(
                            index,
                            "priceMinNGN",
                            Number(
                              e
                                .target
                                .value,
                            ),
                          )
                        }
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-slate-400">
                        to
                      </span>
                      <input
                        type="number"
                        placeholder="Max"
                        required
                        value={
                          guide.priceMaxNGN
                        }
                        onChange={(
                          e,
                        ) =>
                          handleUpdateGuide(
                            index,
                            "priceMaxNGN",
                            Number(
                              e
                                .target
                                .value,
                            ),
                          )
                        }
                        className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={
                        guide.category
                      }
                      onChange={(
                        e,
                      ) =>
                        handleUpdateGuide(
                          index,
                          "category",
                          e
                            .target
                            .value,
                        )
                      }
                      className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                    >
                      <option value="Regular">
                        Regular
                      </option>
                      <option value="Hybrid">
                        Hybrid
                      </option>
                      <option value="Electric">
                        Electric
                      </option>
                      <option value="Luxury">
                        Luxury
                      </option>
                      <option value="Exotic">
                        Exotic
                      </option>
                    </select>
                  </div>

                  {/* Hybrid File Upload / URL Input */}
                  <div className="col-span-12 flex gap-4 items-end mt-2 pt-4 border-t border-slate-200">
                    <div className="flex-grow">
                      <label className="flex items-center gap-1 text-xs font-semibold text-slate-700 mb-1">
                        <ImageIcon
                          size={
                            14
                          }
                          className="text-slate-500"
                        />
                        Image
                        URL
                        or
                        Direct
                        Upload
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          required
                          value={
                            guide.imageUrl
                          }
                          onChange={(
                            e,
                          ) =>
                            handleUpdateGuide(
                              index,
                              "imageUrl",
                              e
                                .target
                                .value,
                            )
                          }
                          className="flex-grow bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <span className="text-xs font-bold text-slate-400">
                          OR
                        </span>
                        <label
                          className={`cursor-pointer px-4 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${uploadingIndex === index ? "bg-slate-300 text-slate-500" : "bg-slate-200 hover:bg-slate-300 text-slate-700"}`}
                        >
                          <UploadCloud
                            size={
                              14
                            }
                          />
                          {uploadingIndex ===
                          index
                            ? "Uploading..."
                            : "Upload File"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={
                              uploadingIndex ===
                              index
                            }
                            onChange={(
                              e,
                            ) =>
                              handleImageUpload(
                                index,
                                e
                                  .target
                                  .files[0],
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    <div className="w-16 h-12 flex-shrink-0 bg-slate-200 rounded-md border border-slate-300 overflow-hidden flex items-center justify-center">
                      {guide.imageUrl ? (
                        <img
                          src={
                            guide.imageUrl
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(
                            e,
                          ) =>
                            (e.target.src =
                              "https://via.placeholder.com/150?text=Invalid+URL")
                          }
                        />
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          No
                          Image
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}

            {settings
              .priceGuides
              .length <
              10 && (
              <button
                type="button"
                onClick={
                  handleAddGuide
                }
                className="w-full py-4 border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus
                  size={
                    18
                  }
                />{" "}
                Add
                New
                Price
                Guide
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              saving ||
              uploadingIndex !==
                null
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors shadow-md disabled:bg-blue-300"
          >
            <Save
              size={
                20
              }
            />
            {saving
              ? "Saving to Database..."
              : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}
