import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, CheckCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartQuantity, clearCart, user } =
    useAppContext();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
  });

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.fullName ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode ||
      !formData.cardNumber
    ) {
      alert("Please fill in all fields");
      return;
    }

    // Simulate order placement
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20 pb-10">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-linear-to-br from-green-400 to-emerald-600 p-6 rounded-full shadow-lg shadow-green-500/30">
              <CheckCircle size={64} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Order Placed! 🎉
          </h1>
          <p className="text-slate-600 text-lg mb-2">
            Thank you for your purchase
          </p>
          <p className="text-slate-500 mb-8">Redirecting to home page...</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Your cart is empty
          </h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Shopping
        </button>

        <h1 className="text-4xl font-bold text-slate-900 mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Shipping Info */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="fullName"
                    autoComplete="name"
                    aria-label="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    aria-label="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    aria-label="Street Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      autoComplete="address-level2"
                      aria-label="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                    />
                    <input
                      type="text"
                      name="state"
                      autoComplete="address-level1"
                      aria-label="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                  <input
                    type="text"
                    name="zipCode"
                    autoComplete="postal-code"
                    aria-label="ZIP Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP Code"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="cardNumber"
                    autoComplete="cc-number"
                    aria-label="Card Number"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="Card Number (4111 1111 1111 1111)"
                    maxLength="19"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      autoComplete="cc-exp"
                      aria-label="Card Expiry"
                      placeholder="MM/YY"
                      className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                    />
                    <input
                      type="text"
                      autoComplete="cc-csc"
                      aria-label="Card Security Code"
                      placeholder="CVV"
                      className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                className="w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-4 rounded-lg transition-all text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
              >
                Place Order (${total.toFixed(2)})
              </button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-slate-200"
                >
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-slate-900 font-semibold line-clamp-2 text-sm">
                      {item.title}
                    </p>
                    <p className="text-amber-600 text-sm">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Minus size={14} className="text-slate-600" />
                      </button>
                      <span className="text-slate-600 text-xs min-w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        <Plus size={14} className="text-slate-600" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-1 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="space-y-3 border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Tax (10%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-green-600">
                  Free shipping for orders over $50!
                </p>
              )}
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900 text-lg">
                <span>Total:</span>
                <span className="text-amber-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
