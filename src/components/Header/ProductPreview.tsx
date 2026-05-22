import React, { useState, useEffect, forwardRef, ForwardedRef } from "react";
import "./ProductPreview.scss";
import tire from "../../assets/images/noImage.png";
import { useLanguage } from "../../context/Language";

const ProductPreview = forwardRef<
  HTMLDivElement,
  { products: any[]; onSelectProduct: (product: any) => void }
>(({ products, onSelectProduct }, ref: ForwardedRef<HTMLDivElement>) => {
  const { currentLanguage } = useLanguage();
  return products?.length > 0 ? (
    <div className="product-preview" ref={ref}>
      {products?.map((product: any) => (
        <div
          key={product.Barcode}
          className="product-preview-item"
          onClick={() => onSelectProduct(product)}
        >
          <img
            src={product?.images[0] || tire}
            alt={product.description}
            className="product-preview-image"
          />
          <div className="product-details">
            <span>{product.description}</span>
            <div className="price">{product.price.toFixed(2)}€</div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="product-preview-notfound" ref={ref}>
      {currentLanguage === "en"
        ? "No products found"
        : "Nuk u gjet asnjë produkt"}
    </div>
  );
});

export default ProductPreview;
