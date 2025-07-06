// server.js

import express, { json } from "express";
import axios from "axios";
import cors from "cors";
import productsData from "../products.json" with { type: "json" };import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(json()); // To parse JSON request bodies

// --- Gold Price API Configuration ---
const METAL_PRICE_API_BASE_URL = "https://api.metalpriceapi.com/v1/latest";
const METAL_PRICE_API_KEY = process.env.METAL_PRICE_API_KEY;

// Cache for gold price to avoid hitting the API too frequently
let cachedGoldPrice = null;
let lastFetchTime = 0;
const GOLD_PRICE_CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

// Function to fetch real-time gold price
async function getGoldPrice() {
  const now = Date.now();
  if (cachedGoldPrice && now - lastFetchTime < GOLD_PRICE_CACHE_DURATION) {
    console.log("Using cached gold price.");
    return cachedGoldPrice;
  }

  if (!METAL_PRICE_API_KEY) {
    console.error("METAL_PRICE_API_KEY is not set in .env file.");
    // Fallback or error handling if API key is missing
    return 65; // Return a default value or throw an error
  }

  try {
    console.log("Fetching fresh gold price...");
    const response = await axios.get(METAL_PRICE_API_BASE_URL, {
      params: {
        access_key: process.env.METAL_PRICE_API_KEY,
        base: "USD",
        currencies: "XAU",
      },
    });

    // Debug: Log the full response to see the structure
    console.log("API Response:", JSON.stringify(response.data, null, 2));

    // Check if the response has the expected structure
    if (!response.data || !response.data.rates) {
      console.error("Invalid API response structure:", response.data);
      return 65; // Fallback
    }

    const xauRatePerUsd = response.data.rates.XAU;
    if (xauRatePerUsd) {
      const pricePerTroyOunceUSD = 1 / xauRatePerUsd;
      const pricePerGramUSD = pricePerTroyOunceUSD / 31.1035; // 1 troy ounce = 31.1035 grams
      cachedGoldPrice = pricePerGramUSD;
      lastFetchTime = now;
      console.log(
        `Fetched gold price per gram: $${cachedGoldPrice.toFixed(2)}`
      );
      return cachedGoldPrice;
    } else {
      console.error("XAU rate not found in Metals-API response.");
      console.error("Available rates:", Object.keys(response.data.rates || {}));
      return 65; // Fallback
    }
  } catch (error) {
    console.error("Error fetching gold price:", error.message);
    // Check if it's an API error with response data
    if (error.response) {
      console.error("API Error Response:", error.response.data);
      console.error("API Error Status:", error.response.status);
    }
    // Implement robust error handling, e.g., retry logic, using a default value.
    // For now, we'll return a default price.
    return 65; // A reasonable default gold price per gram in USD for demonstration
  }
}

// Function to calculate product price
async function calculateProductPrice(product, goldPrice) {
  const popularityScoreDecimal = product.popularityScore;
  const price = (popularityScoreDecimal + 1) * product.weight * goldPrice;
  return parseFloat(price.toFixed(2)); // Format to 2 decimal places
}

// Function to convert popularity score to a 1-5 scale
function convertPopularityToFiveScale(popularityScore) {
  // Popularity score is a percentage (0-100)
  // Scale: (score / 100) * 4 + 1  (This maps 0 to 1, and 100 to 5)
  const scoreFiveScale = popularityScore * 4 + 1;
  return parseFloat(scoreFiveScale.toFixed(1)); // One decimal place
}

// --- API Endpoints ---

// GET /api/products
// Optional query parameters: priceMin, priceMax, popularityMin, popularityMax
app.get("/api/products", async (req, res) => {
  try {
    const goldPrice = await getGoldPrice();
    if (!goldPrice) {
      return res
        .status(500)
        .json({ message: "Could not retrieve gold price." });
    }

    let productsWithPrices = await Promise.all(
      productsData.map(async (product) => {
        const price = await calculateProductPrice(product, goldPrice);
        const popularityFiveScale = convertPopularityToFiveScale(
          product.popularityScore
        );

        // Extract image URLs from the nested 'images' object
        const imageURLs = Object.values(product.images); // Gets an array of the URLs

        return {
          ...product,
          price: price,
          popularityFiveScale: popularityFiveScale,
          // Add an 'imageURLs' array for easier frontend consumption
          imageURLs: imageURLs,
        };
      })
    );

    // --- Filtering (Bonus Feature) ---
    const { priceMin, priceMax, popularityMin, popularityMax } = req.query;

    let filteredProducts = productsWithPrices;

    if (priceMin) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= parseFloat(priceMin)
      );
    }
    if (priceMax) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= parseFloat(priceMax)
      );
    }
    if (popularityMin) {
      // Filter by the 1-5 scale popularity score
      filteredProducts = filteredProducts.filter(
        (product) => product.popularityFiveScale >= parseFloat(popularityMin)
      );
    }
    if (popularityMax) {
      // Filter by the 1-5 scale popularity score
      filteredProducts = filteredProducts.filter(
        (product) => product.popularityFiveScale <= parseFloat(popularityMax)
      );
    }

    res.json(filteredProducts);
  } catch (error) {
    console.error("Error processing products:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
