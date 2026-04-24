import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email && password) {
        const user = {
          id: Math.random(),
          email,
          name: email.split("@")[0],
          isGuest: false,
          loginTime: new Date().toISOString(),
        };
        login(user);
        navigate("/");
      } else {
        setError("Please fill in all fields");
        setLoading(false);
      }
    }, 800);
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: Math.random(),
      email: "guest@shopzone.local",
      name: "Guest User",
      isGuest: true,
      loginTime: new Date().toISOString(),
    };
    login(guestUser);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-20 pb-10 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-600/20 mx-auto mb-4">
              <span className="text-slate-950 font-bold text-2xl">Z</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">Sign in to your ShopZone account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="animate-spin">⏳</div>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">
                or continue as
              </span>
            </div>
          </div>

          {/* Guest Login Button */}
          <button
            onClick={handleGuestLogin}
            className="w-full border-2 border-amber-500 hover:border-amber-600 hover:bg-amber-50 text-amber-600 font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <User size={18} />
            Login as Guest
          </button>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-300 rounded-lg">
            <p className="text-xs text-slate-600">
              <span className="text-amber-600 font-semibold">Demo Tip:</span>{" "}
              Use any email and password. Or login as a guest to browse the
              store!
            </p>
          </div>

          {/* Features List */}
          <div className="mt-6 space-y-2">
            <p className="text-xs text-slate-600 text-center font-medium mb-3">
              Why sign in?
            </p>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex gap-2">
                <span className="text-amber-600">✓</span>
                <span>Persistent shopping cart</span>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-600">✓</span>
                <span>Checkout without restrictions</span>
              </div>
              <div className="flex gap-2">
                <span className="text-amber-600">✓</span>
                <span>Order history & tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
