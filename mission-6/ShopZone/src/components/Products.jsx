import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star, Loader } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [justAddedId, setJustAddedId] = useState(null);
  const { addToCart, cart } = useAppContext();
  const addToCartTimeoutRef = useRef(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();
        setProducts(data.products);

        // Extract unique categories
        const cats = ["all", ...new Set(data.products.map((p) => p.category))];
        setCategories(cats);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const isInCart = (productId) => {
    return cart.some((item) => item.id === productId);
  };

  const getBestImage = (product) => {
    return product.images?.[0] || product.thumbnail;
  };

  const getCategoryTone = (category) => {
    const normalized = String(category || "").toLowerCase();

    if (normalized.includes("beauty")) {
      return {
        badge: "bg-rose-50 text-rose-700 border border-rose-200",
        topBorder: "border-t-rose-300",
      };
    }

    if (normalized.includes("fragrance")) {
      return {
        badge: "bg-violet-50 text-violet-700 border border-violet-200",
        topBorder: "border-t-violet-300",
      };
    }

    if (normalized.includes("grocery")) {
      return {
        badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        topBorder: "border-t-emerald-300",
      };
    }

    if (normalized.includes("home") || normalized.includes("furniture")) {
      return {
        badge: "bg-sky-50 text-sky-700 border border-sky-200",
        topBorder: "border-t-sky-300",
      };
    }

    return {
      badge: "bg-amber-50 text-amber-700 border border-amber-200",
      topBorder: "border-t-amber-300",
    };
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setJustAddedId(product.id);

    if (addToCartTimeoutRef.current) {
      window.clearTimeout(addToCartTimeoutRef.current);
    }

    addToCartTimeoutRef.current = window.setTimeout(() => {
      setJustAddedId(null);
    }, 700);
  };

  useEffect(() => {
    return () => {
      if (addToCartTimeoutRef.current) {
        window.clearTimeout(addToCartTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Loader size={48} className="text-amber-600 animate-spin" />
          <p className="text-slate-600">Loading the product catalog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-atmosphere pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Filter Rail */}
        <section
          className="layout-section-gap motion-fade-up grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-8 items-start"
          style={{ animationDelay: "60ms" }}
        >
          <div className="layout-stack-block">
            <div className="layout-stack-tight">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Discover the collection
              </h1>
              <p className="text-slate-600 text-base md:text-lg max-w-2xl">
                Curated picks for everyday use.
              </p>
            </div>
            <div className="inline-flex w-fit items-center rounded-full bg-white/90 border border-amber-200 px-4 py-1.5 text-sm font-medium text-slate-700">
              {filteredProducts.length} products available
            </div>
          </div>

          <div
            className="surface-cool border border-slate-200 rounded-xl p-4 md:p-5 motion-fade-up"
            style={{ animationDelay: "130ms" }}
          >
            <p className="text-xs font-semibold tracking-wide uppercase text-slate-500 mb-3">
              Browse by category
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat, index) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{ animationDelay: `${180 + index * 50}ms` }}
                  className={`motion-fade-up motion-press px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                    selectedCategory === cat
                      ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                      : "bg-white/80 text-slate-700 hover:bg-sky-100 border border-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
            We couldn’t load the products. Please refresh and try again.
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">
              No products match this filter. Try another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const tone = getCategoryTone(product.category);

              return (
                <div
                  key={product.id}
                  style={{
                    animationDelay: `${Math.min(120 + index * 50, 480)}ms`,
                  }}
                  className={`group motion-card-enter motion-surface bg-white border border-slate-200 border-t-2 ${tone.topBorder} rounded-xl overflow-hidden hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100 h-full flex flex-col`}
                >
                  {/* Product Image */}
                  <Link to={`/product/${product.id}`}>
                    <div className="relative bg-slate-100 overflow-hidden aspect-4/3">
                      <img
                        src={getBestImage(product)}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain p-3 group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-900/5 to-transparent" />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4 md:p-5 layout-stack-block h-full">
                    <p
                      className={`inline-flex text-[11px] font-semibold uppercase tracking-[0.08em] w-fit px-2.5 py-1 rounded-full ${tone.badge}`}
                    >
                      {product.category}
                    </p>

                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-slate-900 text-base md:text-lg font-semibold leading-snug line-clamp-2 group-hover:text-amber-700 transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.round(product.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-slate-500 ml-1">
                        ({product.rating})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold tracking-tight text-amber-700">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-xs font-semibold bg-rose-50 text-rose-700 px-2 py-1 rounded">
                          -{product.discountPercentage.toFixed(0)}%
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        to={`/product/${product.id}`}
                        className="motion-press flex-1 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                      >
                        View details
                      </Link>
                      <button
                        onClick={() => handleAddToCart(product)}
                        aria-label={`Add ${product.title} to cart`}
                        className={`motion-press flex-1 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                          justAddedId === product.id ? "motion-success" : ""
                        } ${
                          isInCart(product.id)
                            ? "bg-amber-600 text-white hover:bg-amber-700"
                            : "bg-amber-50 text-amber-700 border border-amber-600 hover:bg-amber-600 hover:text-white"
                        }`}
                      >
                        <ShoppingBag size={18} />
                        {justAddedId === product.id
                          ? "Added to cart"
                          : isInCart(product.id)
                            ? "In cart"
                            : "Add to cart"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
