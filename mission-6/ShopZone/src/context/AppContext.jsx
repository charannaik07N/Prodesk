import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("shopzone_user");
    const savedCart = localStorage.getItem("shopzone_cart");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    setLoading(false);
  }, []);

  // Persist cart to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("shopzone_cart", JSON.stringify(cart));
    }
  }, [cart, loading]);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("shopzone_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shopzone_user");
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem("shopzone_user");
    localStorage.removeItem("shopzone_cart");
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    user,
    cart,
    loading,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
