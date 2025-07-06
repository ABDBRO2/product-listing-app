"use client";

import { useState, useEffect } from "react";

const StarRating = ({ score }) => {
  const renderStars = () => {
    const starsHtml = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= score) {
        starsHtml.push(
          <span key={i} className="star filled">
            ★
          </span>
        );
      } else if (i - 0.5 <= score) {
        starsHtml.push(
          <span key={i} className="star half-filled">
            ★
          </span>
        );
      } else {
        starsHtml.push(
          <span key={i} className="star empty">
            ★
          </span>
        );
      }
    }
    return <div className="stars">{starsHtml}</div>;
  };

  return renderStars();
};

const ProductCard = ({ product }) => {
  const imageOptions = Object.keys(product.images).map((colorKey) => ({
    color: colorKey,
    url: product.images[colorKey],
  }));

  const [selectedColor, setSelectedColor] = useState(
    imageOptions[0]?.color || "yellow"
  );

  useEffect(() => {
    if (!imageOptions.some((option) => option.color === selectedColor)) {
      setSelectedColor(imageOptions[0]?.color || "yellow");
    }
  }, [product.images, selectedColor, imageOptions]);

  const currentImageUrl = product.images[selectedColor] || imageOptions[0]?.url;

  const colorDisplayNames = {
    yellow: "Yellow Gold",
    white: "White Gold",
    rose: "Rose Gold",
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={currentImageUrl || "/placeholder.svg"}
          alt={`${product.name} in ${selectedColor}`}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)} USD</p>

        <div className="color-picker">
          {imageOptions.map((option) => (
            <div
              key={option.color}
              className={`color-option ${option.color} ${
                selectedColor === option.color ? "selected" : ""
              }`}
              onClick={() => setSelectedColor(option.color)}
              title={colorDisplayNames[option.color] || option.color}
            />
          ))}
        </div>

        <p className="color-label">
          {colorDisplayNames[selectedColor] ||
            selectedColor.charAt(0).toUpperCase() + selectedColor.slice(1)}
        </p>

        <div className="popularity-score">
          <StarRating score={product.popularityFiveScale} />
          <span className="rating-text">
            {product.popularityFiveScale.toFixed(1)}/5
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
