
---

<!-- PROJECT BADGES -->

[![Node.js](https://img.shields.io/badge/node-v18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-v18.x-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-v5.x-lightgrey)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

# Product Listing Application

> A full‑stack demo that fetches product data from JSON, calculates gold‑based prices in real time, and displays them in a sleek, horizontally scrollable React carousel.

## 🚀 Features

### Backend (Node.js + Express)

- **REST API**
  Serves product data from `products.json`.
- **Dynamic Price Calculation**

  ```
  Price = (popularityScore + 1) * weight * currentGoldPrice
  ```

  - Fetches live gold price via [METAL_PRICE_API](https://metalpriceapi.com/)
  - In‑memory caching (default TTL: 5 minutes)

- **Popularity Conversion**
  Maps 0–1 popularity to a 1–5 star scale for frontend.
- **Filtering**
  Query params to narrow by `priceMin`, `priceMax`, `popularityMin`, `popularityMax`.
- **CORS + Environment**

  - CORS enabled for the frontend origin
  - Uses `dotenvx` for `METAL_PRICE_API_KEY_API_KEY`

### Frontend (React + Vite)

- **Carousel UI**

  - Horizontal scroll with global arrows & swipe support.
  - Progress bar indicator.

- **Product Cards**

  - Name, computed price (USD)
  - Color picker: Yellow, White, Rose gold variants
  - 1–5 star popularity rating

- **Responsive**
  Adapts to mobile/desktop with touch & click navigation.
- **Dev Experience**
  Powered by Vite (HMR, fast builds).

---

## 📦 Tech Stack

| Layer        | Technology            |
| ------------ | --------------------- |
| **API**      | Node.js, Express      |
| **Client**   | React, Vite           |
| **Data**     | Local `products.json` |
| **External** | METAL_PRICE_API       |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+
- **npm** (bundled with Node.js)
- METAL_PRICE_API (free tier available)

---

### 1. Clone Repository

```bash
git clone https://github.com/your-username/product-listing-app.git
cd product-listing-app
```

---

### 2. Backend Setup

1. **Create** `products.json` in `backend/` (see example below).
2. **Install deps**

   ```bash
   cd backend
   npm install
   ```

3. **Configure**

   ```bash
   cp .env.example .env
   # then edit .env:
   METAL_PRICE_API_KEY=YOUR_METAL_PRICE_API_KEY
   ```

4. **Run**

   ```bash
   npm start
   ```

   Defaults to `http://localhost:5000`.

<details>
<summary><strong>Example <code>products.json</code></strong></summary>

```json
[
  {
    "name": "Engagement Ring 1",
    "popularityScore": 0.85,
    "weight": 2.1,
    "images": {
      "yellow": "https://cdn.shopify.com/s/files/…",
      "rose": "https://cdn.shopify.com/s/files/…",
      "white": "https://cdn.shopify.com/s/files/…"
    }
  }
  // …more products
]
```

</details>

---

### 3. Frontend Setup

1. **Install deps**

   ```bash
   cd ../frontend
   npm install
   ```

2. **Run**

   ```bash
   npm run dev
   ```

   Opens at `http://localhost:5173`.

---

## 🔌 API Reference

**GET** `/api/products`
Returns all products with computed `price` and `popularity` (1–5).

**Optional Query Params:**

- `priceMin`, `priceMax` (numbers, USD)
- `popularityMin`, `popularityMax` (1–5 scale)

<kbd>GET [http://localhost:5000/api/products?priceMin=500\&popularityMax=4.5](http://localhost:5000/api/products?priceMin=500&popularityMax=4.5)</kbd>

---

## 📁 Project Structure

```
product-listing-app/
├── backend/
│   ├── server.js
│   ├── products.json
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── ProductCard.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## 🤝 Contributing

1. Fork this repo
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m 'Add some feature'`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

Please open issues for bugs or feature requests.

---

## 📝 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- [METAL_PRICE_API ](https://metalpriceapi.com/)
