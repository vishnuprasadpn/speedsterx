import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string | bigint | { toString(): string }): string {
  let numPrice: number;
  if (typeof price === "string") {
    numPrice = parseFloat(price);
  } else if (typeof price === "bigint") {
    numPrice = Number(price);
  } else if (typeof price === "object" && price !== null && "toString" in price) {
    // Handle Prisma Decimal type
    numPrice = parseFloat(price.toString());
  } else {
    numPrice = Number(price);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numPrice);
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `RC-${year}-${random}`;
}

