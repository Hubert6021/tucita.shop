// File deprecated. Ecommerce functionality removed by user request.
import React from 'react';
export const CartProvider = ({ children }) => <>{children}</>;
export const useCart = () => ({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getCartTotal: () => '0.00'
});