import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader, ShoppingBag, Star } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to load product details");
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const imageList = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    return product.thumbnail ? [product.thumbnail] : [];
  }, [product]);

  const isInCart = product
    ? cart.some((item) => item.id === product.id)
    : false;

  const stockTone = product
    ? product.stock > 30
      ? "text-emerald-700 bg-emerald-100 border-emerald-200"
      : product.stock > 10
        ? "text-amber-700 bg-amber-100 border-amber-200"
        : "text-rose-700 bg-rose-100 border-rose-200"
    : "text-slate-700 bg-slate-100 border-slate-200";

  if (loading) {
    return (
      <div className="min-h-screen page-atmosphere flex items-center justify-center px-4 py-20 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader size={48} className="text-amber-600 animate-spin" />
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen page-atmosphere pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 items-center gap-2 text-amber-600 hover:text-amber-700 mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-md"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg">
            {error || "Product not found"}
          </div>
          <Link
            to="/"
            className="inline-flex mt-6 px-6 py-3 rounded-lg bg-amber-600 text-white font-semibold hover:bg-amber-700 transition-colors"
          >
            Go to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-atmosphere pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="motion-press inline-flex min-h-11 items-center gap-2 text-amber-600 hover:text-amber-700 mb-6 sm:mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-md"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 layout-section-gap">
          <div>
            <div
              className="motion-fade-up aspect-4/3 sm:aspect-5/4 lg:aspect-square bg-linear-to-br from-amber-50 via-white to-slate-100 rounded-2xl overflow-hidden border border-amber-100 shadow-sm shadow-amber-100/60"
              style={{ animationDelay: "80ms" }}
            >
              {imageList.length > 0 && (
                <img
                  key={imageList[activeImage]}
                  src={imageList[activeImage]}
                  alt={product.title}
                  className="motion-image-fade w-full h-full object-contain p-4 sm:p-6"
                />
              )}
            </div>

            {imageList.length > 1 && (
              <div
                className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 mt-3 sm:mt-4 motion-fade-up"
                style={{ animationDelay: "130ms" }}
              >
                {imageList.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(idx)}
                    aria-label={`View image ${idx + 1} of ${product.title}`}
                    className={`motion-press motion-surface h-16 sm:h-20 rounded-lg overflow-hidden border transition-colors ${
                      activeImage === idx
                        ? "border-amber-500 ring-2 ring-amber-100"
                        : "border-slate-200 hover:border-amber-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="motion-fade-up layout-stack-block"
            style={{ animationDelay: "170ms" }}
          >
            <p className="inline-flex text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 uppercase tracking-[0.08em] mb-2 px-3 py-1 rounded-full">
              {product.category}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900 mb-3">
              {product.title}
            </h1>

            {product.brand && (
              <p className="text-slate-600 mb-3">
                Brand:{" "}
                <span className="font-semibold text-slate-800">
                  {product.brand}
                </span>
              </p>
            )}

            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-slate-600">{product.rating}</span>
            </div>

            <div className="flex items-baseline gap-3 mb-5 flex-wrap">
              <span className="text-4xl font-bold tracking-tight text-amber-700">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-sm bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 rounded-full font-semibold">
                  -{product.discountPercentage.toFixed(0)}%
                </span>
              )}
            </div>

            <p className="text-slate-700 leading-relaxed max-w-prose text-base sm:text-[1.05rem]">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className={`border rounded-lg p-3 ${stockTone}`}>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Stock
                </p>
                <p className="text-slate-900 font-semibold mt-1">
                  {product.stock}
                </p>
              </div>
              <div className="surface-cool border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  SKU
                </p>
                <p className="text-slate-900 font-semibold mt-1">
                  {product.sku || "-"}
                </p>
              </div>
              <div className="surface-cool border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Weight
                </p>
                <p className="text-slate-900 font-semibold mt-1">
                  {product.weight || "-"}
                </p>
              </div>
              <div className="surface-cool border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Min order qty
                </p>
                <p className="text-slate-900 font-semibold mt-1">
                  {product.minimumOrderQuantity || "-"}
                </p>
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              className={`motion-press min-h-12 w-full py-3.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isInCart
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-slate-100 text-amber-600 border border-amber-600 hover:bg-amber-600 hover:text-white"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`}
            >
              <ShoppingBag size={18} />
              {isInCart ? "In Cart" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div
          className="motion-fade-up bg-white/90 border border-amber-100 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm shadow-amber-100/50"
          style={{ animationDelay: "230ms" }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-5 sm:mb-6">
            Product Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">
                Availability
              </p>
              <p className="text-slate-900 font-medium">
                {product.availabilityStatus || "-"}
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 lg:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-1">
                Warranty
              </p>
              <p className="text-slate-900 font-medium">
                {product.warrantyInformation || "-"}
              </p>
            </div>

            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700 mb-1">
                Shipping
              </p>
              <p className="text-slate-900 font-medium">
                {product.shippingInformation || "-"}
              </p>
            </div>

            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700 mb-1">
                Return policy
              </p>
              <p className="text-slate-900 font-medium">
                {product.returnPolicy || "-"}
              </p>
            </div>

            <div className="surface-cool rounded-xl p-4 border border-slate-200 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Dimensions
              </p>
              <p className="text-slate-900 font-medium wrap-break-word">
                {product.dimensions
                  ? `${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth}`
                  : "-"}
              </p>
            </div>

            <div className="surface-cool rounded-xl p-4 border border-slate-200 lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                Tags
              </p>
              {Array.isArray(product.tags) && product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-900 font-medium">No tags available</p>
              )}
            </div>
          </div>
        </div>

        {Array.isArray(product.reviews) && product.reviews.length > 0 && (
          <div
            className="motion-fade-up bg-white/90 border border-amber-100 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm shadow-amber-100/50"
            style={{ animationDelay: "280ms" }}
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-5 sm:mb-6">
              Customer Reviews
            </h2>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div
                  key={`${review.reviewerEmail}-${index}`}
                  className="border border-slate-200 rounded-xl p-4 bg-white"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-2">
                    <p className="font-semibold text-slate-900">
                      {review.reviewerName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {review.date?.slice(0, 10)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < Math.round(review.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-slate-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
