import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, FolderTree, ShoppingBag, FileText, Shield } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow both ADMIN and MANAGER roles
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-24 shadow-lg">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Admin Panel</h2>
                <p className="text-xs text-slate-400">Management Dashboard</p>
              </div>
              <nav className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors text-white group"
                >
                  <LayoutDashboard className="h-5 w-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 group"
                >
                  <Package className="h-5 w-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Products</span>
                </Link>
                <Link
                  href="/admin/categories"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 group"
                >
                  <FolderTree className="h-5 w-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Categories</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 group"
                >
                  <ShoppingBag className="h-5 w-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Orders</span>
                </Link>
                <Link
                  href="/admin/pages"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 group"
                >
                  <FileText className="h-5 w-5 group-hover:text-primary transition-colors" />
                  <span className="font-medium">Pages</span>
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin/users"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 group"
                  >
                    <Shield className="h-5 w-5 group-hover:text-primary transition-colors" />
                    <span className="font-medium">User Management</span>
                  </Link>
                )}
              </nav>
            </div>
          </aside>
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}

