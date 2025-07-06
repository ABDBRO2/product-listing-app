"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "./components/ProductCard";
import "./index.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productListRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const productsWithIds = data.map((product, index) => ({
          ...product,
          id: product.id || `product-${index}`,
        }));
        setProducts(productsWithIds);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollCarousel = (direction) => {
    if (productListRef.current) {
      const scrollAmount = productListRef.current.offsetWidth * 0.8;
      if (direction === "left") {
        productListRef.current.scrollBy({
          left: -scrollAmount,
          behavior: "smooth",
        });
      } else {
        productListRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const handleScroll = () => {
    if (productListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = productListRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(Math.min(progress, 100));
    }
  };

  useEffect(() => {
    const listElement = productListRef.current;
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => {
        listElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [products]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      scrollCarousel("right");
    } else if (diff < -50) {
      scrollCarousel("left");
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (loading) {
    return (
      <div className="app-container loading">
        <div className="loading-text">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container error">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="app-header">
        <h1 className="main-title">Product List</h1>
        <p className="main-subtitle">Avenir - Book - 45</p>
      </div>

      <div className="product-carousel-container">
        <button
          onClick={() => scrollCarousel("left")}
          className="carousel-arrow left"
          aria-label="Scroll left"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div
          className="product-list"
          ref={productListRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <button
          onClick={() => scrollCarousel("right")}
          className="carousel-arrow right"
          aria-label="Scroll right"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="scroll-progress-container">
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
}

export default App;
