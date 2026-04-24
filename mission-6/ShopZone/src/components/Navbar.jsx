import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  User,
  Bell,
  ChevronDown,
  Heart,
  Settings,
  LogOut,
  Trash2,
  Plus,
  Minus,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, cart, removeFromCart, updateCartQuantity } =
    useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [notificationCount] = useState(2);

  const categories = [
    "Electronics",
    "Fashion",
    "Books",
    "Gaming",
    "Home & Living",
  ];

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsAccountOpen(false);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
    setIsCartOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white border-b border-slate-200 backdrop-blur-md shadow-sm">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Brand - Left */}
          <Link
            to="/"
            className="flex items-center gap-3 min-w-fit hover:opacity-80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-lg"
          >
            <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-slate-950 font-bold text-lg">Z</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                ShopZone
              </span>
              <p className="text-xs text-amber-600 font-medium">
                Student Premium
              </p>
            </div>
          </Link>

          {/* Desktop Center Menu & Search */}
          <div className="hidden md:flex items-center gap-8 flex-1 mx-12">
            {/* Navigation Links */}
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-md"
              >
                Home
              </Link>
              <div className="relative group">
                <button className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1">
                  Categories
                  <ChevronDown
                    size={16}
                    className="group-hover:rotate-180 transition-transform"
                  />
                </button>
                <div className="absolute left-0 mt-0 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2">
                  {categories.map((cat, i) => (
                    <a
                      key={i}
                      href={`/#${cat.toLowerCase()}`}
                      className="block px-4 py-2.5 text-sm text-slate-600 hover:text-amber-600 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="/#deals"
                className="text-slate-600 hover:text-amber-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Deals
              </a>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className={`w-full bg-slate-50 border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all ${
                    isSearchActive ? "shadow-md shadow-amber-100" : ""
                  }`}
                  onFocus={() => setIsSearchActive(true)}
                  onBlur={() => setIsSearchActive(false)}
                />
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 group">
              <span className="sr-only">View notifications</span>
              <Bell size={20} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pt-2 z-50">
                <div className="px-4 py-3 border-b border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">
                    Notifications
                  </p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 border-b border-slate-200 transition-colors"
                  >
                    <p className="font-medium text-slate-900">New Deal!</p>
                    <p className="text-xs text-slate-500 mt-1">
                      30% off Electronics
                    </p>
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <p className="font-medium text-slate-900">Order Shipped</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Your order is on the way
                    </p>
                  </a>
                </div>
              </div>
            </button>

            {/* Wishlist */}
            <button
              aria-label="Open wishlist"
              className="h-11 w-11 flex items-center justify-center p-2 text-slate-600 hover:text-amber-600 transition-colors duration-200"
            >
              <Heart size={20} />
            </button>

            {/* Shopping Cart */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Open shopping cart"
              className="motion-press relative h-11 w-11 flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Account Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="motion-press flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  >
                    <div className="w-6 h-6 bg-linear-to-br from-amber-400 to-amber-600 rounded-full"></div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isAccountOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isAccountOpen && (
                    <div className="motion-dropdown-enter absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                      <div className="px-4 py-3 border-b border-slate-200">
                        <p className="text-sm text-slate-900 font-semibold">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <a
                        href="#"
                        className="px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 first:rounded-t-lg flex items-center gap-2 transition-colors"
                      >
                        <User size={16} /> My Profile
                      </a>
                      <Link
                        to="/checkout"
                        className="px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        onClick={() => setIsAccountOpen(false)}
                      >
                        <ShoppingBag size={16} /> My Orders
                      </Link>
                      <a
                        href="#"
                        className="px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <Settings size={16} /> Settings
                      </a>
                      <hr className="border-slate-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:text-red-700 hover:bg-slate-50 last:rounded-b-lg flex items-center gap-2 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="motion-press px-4 py-2 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              aria-label="Open shopping cart"
              className="motion-press relative h-11 w-11 flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-amber-500 text-slate-950 text-xs font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open menu"
              className="h-11 w-11 flex items-center justify-center p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Cart Dropdown */}
      {isCartOpen && (
        <div className="motion-dropdown-enter absolute right-4 top-20 w-96 max-h-96 bg-white border border-slate-200 rounded-lg shadow-lg z-50 flex flex-col md:max-h-125">
          <div className="px-4 py-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 flex justify-between items-center">
              Shopping Cart
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-slate-600 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </h3>
          </div>

          {cart.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 py-8">
              Your cart is empty
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 pb-3 border-b border-slate-200"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-slate-900 font-semibold line-clamp-1 text-sm">
                        {item.title}
                      </p>
                      <p className="text-amber-600 text-sm">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity - 1)
                          }
                          className="p-0.5 hover:bg-slate-100 rounded"
                        >
                          <Minus size={12} className="text-slate-600" />
                        </button>
                        <span className="text-slate-600 text-xs min-w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.id, item.quantity + 1)
                          }
                          className="p-0.5 hover:bg-slate-100 rounded"
                        >
                          <Plus size={12} className="text-slate-600" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto p-0.5 hover:bg-red-50 rounded text-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 px-4 py-4 space-y-3">
                <div className="flex justify-between text-slate-900 font-semibold">
                  <span>Total:</span>
                  <span className="text-amber-600">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="motion-press w-full bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Search */}
          <div className="px-4 py-4 border-b border-slate-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-slate-100 border border-slate-300 rounded-lg pl-4 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          {/* Mobile Menu Items */}
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Home
            </Link>
            <details className="group">
              <summary className="cursor-pointer px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-between">
                Categories
                <ChevronDown
                  size={16}
                  className="group-open:rotate-180 transition-transform"
                />
              </summary>
              <div className="bg-slate-100 rounded-lg mt-2 ml-2 pl-4 space-y-1">
                {categories.map((cat, i) => (
                  <a
                    key={i}
                    href={`/#${cat.toLowerCase()}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-sm text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </details>
            <a
              href="/#deals"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-3 text-slate-600 hover:text-amber-600 rounded-lg transition-colors"
            >
              Deals
            </a>
            <hr className="border-slate-200 my-2" />

            {user ? (
              <>
                <div className="px-4 py-3">
                  <p className="text-slate-900 font-semibold text-sm">
                    {user.name}
                  </p>
                  <p className="text-slate-500 text-xs">{user.email}</p>
                </div>
                <Link
                  to="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <ShoppingBag size={16} /> Checkout
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:text-red-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-600 transition-all text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
