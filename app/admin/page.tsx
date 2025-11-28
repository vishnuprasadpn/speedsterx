import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { format, subDays } from "date-fns";
import Link from "next/link";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  AlertTriangle,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Trophy,
  AlertCircle
} from "lucide-react";

export default async function AdminDashboard() {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const startOfWeek = subDays(startOfToday, 7);
  const startOfMonth = subDays(startOfToday, 30);

  const [
    todaySales,
    weekSales,
    monthSales,
    totalOrders,
    pendingOrders,
    recentOrders,
    topProducts,
    lowStockProducts,
  ] = await Promise.all([
    // Today's sales
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfToday },
        paymentStatus: "PAID",
      },
      _sum: { totalAmount: true },
      _count: true,
    }),
    // Week's sales
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfWeek },
        paymentStatus: "PAID",
      },
      _sum: { totalAmount: true },
      _count: true,
    }),
    // Month's sales
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        paymentStatus: "PAID",
      },
      _sum: { totalAmount: true },
      _count: true,
    }),
    // Total orders
    prisma.order.count(),
    // Pending orders
    prisma.order.count({
      where: { status: "PENDING" },
    }),
    // Recent orders
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
    }),
    // Top products (last 30 days)
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: {
        order: {
          createdAt: { gte: startOfMonth },
          paymentStatus: "PAID",
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    // Low stock products
    prisma.product.findMany({
      where: {
        stock: { lt: 10 },
        isActive: true,
      },
      include: {
        category: true,
      },
      take: 50, // Get more to sort
      orderBy: { stock: "asc" },
    }),
  ]);

  // Get accessories category ID
  const accessoriesCategory = await prisma.category.findUnique({
    where: { slug: "accessories" },
    select: { id: true },
  });

  // Sort low stock products: accessories last
  const sortedLowStock = lowStockProducts.sort((a, b) => {
    const aIsAccessory = accessoriesCategory && a.categoryId === accessoriesCategory.id;
    const bIsAccessory = accessoriesCategory && b.categoryId === accessoriesCategory.id;
    if (aIsAccessory && !bIsAccessory) return 1;
    if (!aIsAccessory && bIsAccessory) return -1;
    return 0;
  });

  const lowStockProductsSorted = sortedLowStock.slice(0, 10);

  // Get product details for top products
  const topProductIds = topProducts
    .map((p) => p.productId)
    .filter((id): id is string => id !== null);
  const topProductDetails = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true },
  });

  const topProductsWithNames = topProducts.map((tp) => ({
    ...tp,
    productName:
      topProductDetails.find((p) => p.id === tp.productId)?.name || "Unknown",
  }));

  const todayAmount = Number(todaySales._sum.totalAmount) || 0;
  const weekAmount = Number(weekSales._sum.totalAmount) || 0;
  const monthAmount = Number(monthSales._sum.totalAmount) || 0;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Sales */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-green-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Today's Sales</h3>
          <p className="text-3xl font-bold text-white mb-2">
            {formatPrice(todayAmount)}
          </p>
          <p className="text-sm text-slate-400">
            {todaySales._count} {todaySales._count === 1 ? 'order' : 'orders'}
          </p>
        </div>

        {/* This Week */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">This Week</h3>
          <p className="text-3xl font-bold text-white mb-2">
            {formatPrice(weekAmount)}
          </p>
          <p className="text-sm text-slate-400">
            {weekSales._count} {weekSales._count === 1 ? 'order' : 'orders'}
          </p>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Package className="h-6 w-6 text-purple-400" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">This Month</h3>
          <p className="text-3xl font-bold text-white mb-2">
            {formatPrice(monthAmount)}
          </p>
          <p className="text-sm text-slate-400">
            {monthSales._count} {monthSales._count === 1 ? 'order' : 'orders'}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-400" />
            </div>
            {pendingOrders > 0 && (
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            )}
          </div>
          <h3 className="text-sm font-medium text-slate-400 mb-1">Pending Orders</h3>
          <p className="text-3xl font-bold text-white mb-2">{pendingOrders}</p>
          <p className="text-sm text-slate-400">of {totalOrders} total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            </div>
            <Link 
              href="/admin/orders"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No orders yet</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-900 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-primary transition-colors">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(new Date(order.createdAt), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-white mb-2">
                        {formatPrice(Number(order.totalAmount))}
                      </p>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          order.status === "PAID"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : order.status === "PENDING"
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : "bg-slate-700 text-slate-300 border border-slate-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Top Products</h2>
            </div>
            <span className="text-xs text-slate-400">Last 30 Days</span>
          </div>
          <div className="space-y-3">
            {topProductsWithNames.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">No sales yet</p>
              </div>
            ) : (
              topProductsWithNames.map((item, index) => (
                <div
                  key={item.productId || index}
                  className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      index === 1 ? 'bg-slate-600 text-slate-300' :
                      index === 2 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.productName}</p>
                      <p className="text-sm text-slate-400">
                        {item._sum.quantity} {item._sum.quantity === 1 ? 'unit' : 'units'} sold
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <h2 className="text-xl font-bold text-white">Low Stock Alert</h2>
          </div>
          {lowStockProductsSorted.length > 0 && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium border border-orange-500/30">
              {lowStockProductsSorted.length} {lowStockProductsSorted.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          {lowStockProductsSorted.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-green-500/50 mx-auto mb-4" />
              <p className="text-slate-300 font-medium mb-1">All products are well stocked</p>
              <p className="text-sm text-slate-500">No action needed at this time</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lowStockProductsSorted.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-900 hover:border-orange-500/50 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                      product.stock < 5
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    }`}>
                      {product.stock}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {product.stock < 5 ? "Critical stock level" : "Low stock level"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      product.stock < 5
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    }`}>
                      {product.stock < 5 ? "Critical" : "Low"}
                    </span>
                    <span className="text-slate-500 group-hover:text-primary transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

