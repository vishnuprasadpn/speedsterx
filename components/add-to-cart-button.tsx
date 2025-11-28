"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
}

export function AddToCartButton({ productId, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();
  const { refreshCart } = useCart();

  const handleAddToCart = async () => {
    if (!session) {
      window.location.href = "/auth/login";
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        setSuccess(true);
        refreshCart(); // Update cart count in navbar
        setTimeout(() => setSuccess(false), 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-slate-300">Quantity:</label>
        <div className="flex items-center border border-slate-700 rounded-lg bg-slate-800 overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled || quantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center border-0 bg-slate-800 text-white font-semibold focus:ring-0 focus:outline-none disabled:opacity-50"
            disabled={disabled}
            style={{ WebkitAppearance: 'textfield', MozAppearance: 'textfield' }}
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={disabled}
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={disabled || loading}
        className={`w-full py-3 rounded-lg transition-all font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          success
            ? "bg-green-500 text-white"
            : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {success ? (
          <>
            <Check className="h-5 w-5" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            <span>{loading ? "Adding..." : "Add to Cart"}</span>
          </>
        )}
      </button>
    </div>
  );
}

