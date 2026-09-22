# CarsFromNaija — Technical Architecture & Development Blueprint

This document defines the functional requirements, system architecture, database design, API endpoints, and implementation strategy for building the **CarsFromNaija** e-commerce platform using the **MERN** stack (MongoDB, Express.js, React.js, Node.js).

---

## 1. System Architecture & Tech Stack

```
                        +---------------------------------------+
                        |        Client (React.js + Tailwind)   |
                        +-------------------+-------------------+
                                            |
                                  REST APIs / Axios
                                            |
                        +-------------------v-------------------+
                        |         Node.js + Express.js API       |
                        +---------+-------------------+---------+
                                  |                   |
               +------------------+                   +------------------+
               |                                                         |
     +---------v----------+                                    +---------v----------+
     |   MongoDB Atlas    |                                    | Cloudinary API     |
     | (Primary Database) |                                    | (Image Storage)    |
     +--------------------+                                    +--------------------+
```

### Core Stack
* **Frontend:** React.js (Vite), Tailwind CSS, React Router v6, Axios, Lucide React (Icons), Context API / Redux Toolkit (State Management).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas with Mongoose ORM.
* **Authentication:** JSON Web Tokens (JWT) with HTTP-only cookies and bcryptjs for password hashing.
* **Media Management:** Cloudinary API for image uploads and optimization.
* **Notification & Communication Engines:**
  * **Email:** Nodemailer / SendGrid API.
  * **WhatsApp Integration:** Deep-linking protocol (`https://wa.me/`) and WhatsApp Business Cloud API.

---

## 2. Database Schemas (Mongoose)

### 2.1. Car Listing Schema (`Car.js`)
```javascript
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true }, // e.g., "2020 Mercedes-Benz GLE 450"
    make: { type: String, required: true, index: true },
    model: { type: String, required: true, index: true },
    year: { type: Number, required: true },
    priceUSD: { type: Number, required: true }, // Base buy price in USD
    priceNGN: { type: Number, required: true }, // Current calculated local price
    isNegotiable: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
      index: true
    },
    soldPriceNGN: { type: Number, default: null }, // Final price when marked as sold
    soldAt: { type: Date, default: null }, // Timestamp when marked sold
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true }
      }
    ],
    specs: {
      mileage: { type: Number, required: true },
      transmission: { type: String, enum: ['Automatic', 'Manual'], default: 'Automatic' },
      engineType: { type: String, required: true }, // e.g., "V6 Turbo"
      vin: { type: String, trim: true, uppercase: true },
      color: { type: String }
    },
    // Optional overrides for landed cost calculation
    customShippingUSD: { type: Number, default: null },
    customClearingNGN: { type: Number, default: null }
  },
  { timestamps: true }
);

// Indexing for quick querying of recent sales and inventory filtering
carSchema.index({ status: 1, soldAt: -1 });

module.exports = mongoose.model('Car', carSchema);
```

### 2.2. Budget Inquiry Schema (`Inquiry.js`)
```javascript
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    budgetNGN: { type: Number, required: true },
    preferredCategory: { type: String, default: 'Any' }, // e.g., "SUV", "Sedan"
    status: {
      type: String,
      enum: ['Pending', 'Responded', 'Closed'],
      default: 'Pending'
    },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
```

### 2.3. System Settings Schema (`Settings.js`)
```javascript
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    exchangeRateUSDToNGN: { type: Number, required: true, default: 1550 },
    standardShippingUSD: { type: Number, required: true, default: 2500 }, // RORO shipping estimate
    standardClearingNGN: { type: Number, required: true, default: 3500000 }, // Customs & Port duty estimate
    dealerPhoneWhatsApp: { type: String, required: true, default: '2348000000000' },
    dealerEmail: { type: String, required: true, default: 'sales@carsfromnaija.com' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
```

---

## 3. REST API Specification

### Public Routes (`/api/v1/public`)

| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/cars` | Get available cars | `?make=Toyota&minPrice=10000000&maxPrice=30000000&page=1` |
| `GET` | `/cars/recent-sales` | Fetch exactly the last 3 sold cars | None (Enforces `status=sold&limit=3&sort=-soldAt`) |
| `GET` | `/cars/:id` | Fetch single car details | `id` in URL parameters |
| `POST` | `/inquiries/budget` | Submit customer budget inquiry | `{ customerName, phoneNumber, email, budgetNGN, preferredCategory }` |
| `GET` | `/settings/config` | Get current FX rates and estimation settings | None |

### Dealer / Admin Protected Routes (`/api/v1/admin`) — Requires JWT Header

| Method | Endpoint | Description | Payload Example |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Dealer authentication | `{ username, password }` |
| `POST` | `/cars` | Post a new car listing | `FormData` (Includes vehicle fields + binary image files) |
| `PUT` | `/cars/:id` | Update car specifications/price | Updated car object |
| `PATCH` | `/cars/:id/status` | Change status (e.g., Mark as Sold) | `{ status: "sold", soldPriceNGN: 28000000 }` |
| `DELETE`| `/cars/:id` | Remove a listing | `id` in URL parameters |
| `GET` | `/inquiries` | Fetch all visitor budget inquiries | `?status=Pending` |
| `PATCH` | `/settings` | Update global FX rate & shipping estimates | `{ exchangeRateUSDToNGN: 1600 }` |

---

## 4. Key Architectural Features & Implementation Logic

### 4.1. Recent Sales Logic (Strict Limit: 3 Items)
To display recent sales on the public landing page, the backend executes a constrained query:

```javascript
// controller/carController.js
exports.getRecentSales = async (req, res) => {
  try {
    const recentSales = await Car.find({ status: 'sold' })
      .sort({ soldAt: -1, updatedAt: -1 })
      .limit(3)
      .select('title make model year priceNGN soldPriceNGN images soldAt');

    res.status(200).json({ success: true, data: recentSales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### 4.2. Budget Finder & Dual Dispatch (WhatsApp + Email)
When a visitor inputs their budget in Naira ($\text{NGN}$):

1. **Database Logging:** A new record is stored in the `Inquiries` collection.
2. **Email Dispatch:** Node.js triggers `Nodemailer` to send an immediate alert email to the dealer.
3. **WhatsApp Deep-Link Payload:** The API constructs a pre-filled, URL-encoded WhatsApp link returned to the frontend. The UI automatically opens WhatsApp Web/App with a formatted message payload:

```javascript
// utils/whatsappBuilder.js
const generateWhatsAppLink = (dealerPhone, inquiryData) => {
  const text = `Hello CarsFromNaija! I am looking for a vehicle.\n\n` +
               `*Name:* ${inquiryData.customerName}\n` +
               `*Phone:* ${inquiryData.phoneNumber}\n` +
               `*My Budget:* ₦${inquiryData.budgetNGN.toLocaleString()}\n` +
               `*Preferred Type:* ${inquiryData.preferredCategory}\n\n` +
               `Please let me know what options are available for my budget.`;
               
  return `https://wa.me/${dealerPhone}?text=${encodeURIComponent(text)}`;
};
```

### 4.3. Cost Breakdown & Foreign Exchange Duty Calculator
For imported vehicles listed in foreign currency ($\text{USD}$), the frontend calculates the estimated landed cost using the global variables stored in `Settings`:

$$C_{\text{total}} = (P_{\text{USD}} + S_{\text{USD}}) \times R_{\text{FX}} + D_{\text{NGN}}$$

Where:
* $P_{\text{USD}}$ = Base purchase price of the car ($\text{USD}$)
* $S_{\text{USD}}$ = Standard shipping estimate ($\text{USD}$)
* $R_{\text{FX}}$ = Current USD to NGN exchange rate
* $D_{\text{NGN}}$ = Standard clearing and port customs duty ($\text{NGN}$)

```jsx
// components/CostCalculator.jsx
import React from 'react';

const CostCalculator = ({ carPriceUSD, settings }) => {
  const { exchangeRateUSDToNGN, standardShippingUSD, standardClearingNGN } = settings;

  const basePriceNGN = carPriceUSD * exchangeRateUSDToNGN;
  const shippingCostNGN = standardShippingUSD * exchangeRateUSDToNGN;
  const totalLandedCostNGN = basePriceNGN + shippingCostNGN + standardClearingNGN;

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-bold text-blue-400">Estimated Total Landed Cost</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Vehicle Buy Price ({carPriceUSD.toLocaleString()} USD):</span>
          <span>₦{basePriceNGN.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Est. RORO Shipping ({standardShippingUSD.toLocaleString()} USD):</span>
          <span>₦{shippingCostNGN.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Est. Customs Duty & Port Clearing:</span>
          <span>₦{standardClearingNGN.toLocaleString()}</span>
        </div>
        <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-base text-green-400">
          <span>Total Estimated Cost:</span>
          <span>₦{totalLandedCostNGN.toLocaleString()}</span>
        </div>
      </div>
      <p className="text-xs text-amber-400 italic">
        * Note: This amount is an estimate based on current exchange rates ($1 USD = ₦{exchangeRateUSDToNGN}) and standard clearance fees. Actual landed cost may vary at the time of purchase.
      </p>
    </div>
  );
};

export default CostCalculator;
```

---

## 5. Folder & Directory Structure

```
carsfromnaija/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── inquiryController.js
│   │   └── settingsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Car.js
│   │   ├── Inquiry.js
│   │   ├── Settings.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   └── publicRoutes.js
│   ├── utils/
│   │   ├── emailService.js
│   │   └── whatsappBuilder.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── BudgetFinder.jsx
    │   │   ├── CarCard.jsx
    │   │   ├── CostCalculator.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Navbar.jsx
    │   │   └── RecentSales.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── CarDetail.jsx
    │   │   ├── Home.jsx
    │   │   ├── Inventory.jsx
    │   │   └── admin/
    │   │       ├── AddEditCar.jsx
    │   │       ├── Dashboard.jsx
    │   │       ├── InquiriesList.jsx
    │   │       └── InventoryManager.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── tailwind.config.js
    └── package.json
```

---

## 6. Development Milestones & Implementation Roadmap

### Phase 1: Environment Setup & Core API
1. Initialize the backend workspace with Express, CORS, Mongoose, and dotenv.
2. Establish MongoDB Atlas connection.
3. Configure Cloudinary storage SDK for multipart image handling via `multer`.
4. Construct Mongoose models (`Car`, `Inquiry`, `Settings`, `User`).

### Phase 2: Public Frontend & Inquiry Engine
1. Build React application with Tailwind CSS matching the Figma specifications.
2. Implement home layout: Hero section, `BudgetFinder` module, and inventory list.
3. Construct the `RecentSales` component wired strictly to `GET /api/v1/public/cars/recent-sales`.
4. Implement the `CarDetail` view with the dynamic `CostCalculator` component, generating automated disclaimers and live FX estimations.
5. Hook up the Budget Request form to trigger dual alerts (Database insert + Nodemailer email dispatch + WhatsApp URL generation).

### Phase 3: Dealer Admin Panel & Workflow Controls
1. Build JWT authentication flow for dealer login.
2. Implement Admin Dashboard displaying active inventory count, pending budget requests, and sales performance.
3. Construct the `InventoryManager` table featuring:
   * Instant toggle switches for price negotiability (`isNegotiable`).
   * One-click "Mark as Sold" action modal requiring the input of final `soldPriceNGN`.
4. Create the `AddEditCar` form with direct multi-image drag-and-drop upload to Cloudinary.

### Phase 4: Mobile Responsiveness & Final Deployment
1. Optimize layout breakpoints (`sm`, `md`, `lg`) across both public buyer pages and dealer administration views.
2. Verify touch targets, mobile navigation menus, and mobile WhatsApp deep links.
3. Deploy frontend to Vercel/Netlify and backend services to Render/Railway or AWS EC2.