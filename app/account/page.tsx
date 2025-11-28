import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, MapPin, ShoppingBag } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/account/profile"
          className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
        >
          <User className="h-8 w-8 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile</h2>
          <p className="text-gray-600">Manage your personal information</p>
        </Link>

        <Link
          href="/account/addresses"
          className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
        >
          <MapPin className="h-8 w-8 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Addresses</h2>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </Link>

        <Link
          href="/account/orders"
          className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
        >
          <ShoppingBag className="h-8 w-8 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2">Orders</h2>
          <p className="text-gray-600">View your order history</p>
        </Link>
      </div>
    </div>
  );
}

