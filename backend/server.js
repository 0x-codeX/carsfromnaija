const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const carRoutes = require("./routes/carRoutes");
const settingRoutes = require("./routes/settingRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const recentSalesRoute = require("./routes/recentSales");





const app =
  express();

// Middleware
app.use(
  cors({
    origin:
      [
        "http://localhost:5173",
        "https://carsfromnaija.vercel.app",
      ],
    credentials: true,
  }),
);
app.use(
  express.json(),
); // Parses incoming JSON requests

// Basic Health Check Route
app.get(
  "/api/health",
  (
    req,
    res,
  ) => {
    res
      .status(
        200,
      )
      .json(
        {
          status:
            "success",
          message:
            "CarsFromNaija API is running",
        },
      );
  },
);

// Database Connection
mongoose
  .connect(
    process
      .env
      .MONGO_URI,
  )
  .then(
    () =>
      console.log(
        "✅ MongoDB Connected Successfully",
      ),
  )
  .catch(
    (
      err,
    ) => {
      console.error(
        "❌ MongoDB Connection Error:",
        err.message,
      );
      process.exit(
        1,
      );
    },
  );

  app.use(
    "/api/auth",
    require("./routes/authRoutes"),
  );

  app.use(
    "/api/upload",
    require("./routes/uploadRoutes"),
  );


app.use(
  "/api/cars",
  carRoutes,
);
app.use(
  "/api/settings",
  settingRoutes,
);
app.use(
  "/api/inquiries",
  inquiryRoutes,
);
app.use(
  "/api/recent-sales",
  recentSalesRoute,
);

// Server Initialization
const PORT =
  process
    .env
    .PORT ||
  5000;
app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running on port ${PORT}`,
    );
  },
);
