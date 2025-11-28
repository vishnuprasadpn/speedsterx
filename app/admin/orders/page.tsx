import { prisma } from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";
import { OrdersList } from "@/components/admin/orders-list";

export default async function AdminOrdersPage() {
  const ordersData = await prisma.order.findMany({
    include: {
      user: {
        select: { name: true, email: true },
      },
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const statusCounts = {
    PENDING: ordersData.filter((o) => o.status === "PENDING").length,
    PROCESSING: ordersData.filter((o) => o.status === "PROCESSING").length,
    SHIPPED: ordersData.filter((o) => o.status === "SHIPPED").length,
    DELIVERED: ordersData.filter((o) => o.status === "DELIVERED").length,
    CANCELLED: ordersData.filter((o) => o.status === "CANCELLED").length,
  };

  // Convert Decimal to number for client components
  const orders = ordersData.map((order) => ({
    ...order,
    totalAmount: Number(order.totalAmount),
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-white mb-2">Orders</h1>
          <p className="text-slate-400">Manage and track customer orders</p>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium border border-orange-500/30">
              {statusCounts.PENDING} Pending
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
              {statusCounts.PROCESSING} Processing
            </span>
          </div>
        </div>
      </div>

      <OrdersList orders={orders} />
    </div>
  );
}

