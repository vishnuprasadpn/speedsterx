// Security utilities and checks

/**
 * Validate that all required environment variables are set
 */
export function validateEnvVars() {
  const required = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate NEXTAUTH_SECRET is strong enough
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    console.warn(
      "WARNING: NEXTAUTH_SECRET should be at least 32 characters long"
    );
  }
}

/**
 * Sanitize error messages to prevent information leakage
 */
export function sanitizeError(error: unknown): string {
  if (process.env.NODE_ENV === "development") {
    // In development, show more details
    return error instanceof Error ? error.message : "Unknown error";
  }

  // In production, return generic messages
  return "An error occurred. Please try again.";
}

/**
 * Check if request is from allowed origin (for CORS)
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;

  const allowedOrigins = [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    "http://localhost:3000",
    "https://speedsterx.com", // Add your production domain
  ].filter(Boolean);

  return allowedOrigins.some((allowed) => origin.startsWith(allowed || ""));
}

/**
 * Security headers for responses
 */
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

