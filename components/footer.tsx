import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">
              Speedster<span className="text-primary">X</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your premium destination for RC cars in India.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-slate-400 hover:text-primary transition-colors">
                  All RC Cars
                </Link>
              </li>
              <li>
                <Link href="/category/rc-cars" className="text-slate-400 hover:text-primary transition-colors">
                  Browse Collection
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-slate-400 hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-slate-400 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account" className="text-slate-400 hover:text-primary transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-slate-400 hover:text-primary transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-slate-400 hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} SpeedsterX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

