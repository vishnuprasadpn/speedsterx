"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Menu } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-xl font-bold text-white group-hover:text-primary transition-colors">
              Speedster<span className="text-primary">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/shop" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-slate-300" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {session ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/account"
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-800 rounded-md transition-colors"
                >
                  <User className="h-4 w-4 text-slate-300" />
                  <span className="text-sm text-slate-300">{session.user.name}</span>
                </Link>
                {(session.user.role === "ADMIN" || session.user.role === "MANAGER") && (
                  <Link
                    href="/admin"
                    className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 bg-slate-900">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                Home
              </Link>
              <Link href="/shop" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                Shop
              </Link>
              <Link href="/about" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                About
              </Link>
              <Link href="/contact" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                Contact
              </Link>
              {session ? (
                <>
                  <Link href="/account" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                    Account
                  </Link>
                  {(session.user.role === "ADMIN" || session.user.role === "MANAGER") && (
                    <Link href="/admin" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-left hover:bg-slate-800 rounded-md text-slate-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                    Login
                  </Link>
                  <Link href="/auth/register" className="px-4 py-2 hover:bg-slate-800 rounded-md text-slate-300">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

