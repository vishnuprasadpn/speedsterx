"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { Package, Eye } from "lucide-react";
import { OrderSearchFilters } from "./order-search-filters";

interface Order {
  id: string;
  orderNumber: string;
  user: { name: string | null; email: string | null } | null;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  createdAt: Date;
  items: any[];
}

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);

  return (
    <>
      <OrderSearchFilters orders={orders} onFiltered={setFilteredOrders} />

      {/* Orders List */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Order</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Customer</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Items</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Total</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{order.orderNumber}</div>
                      <div className="text-xs text-slate-500 mt-1">#{order.id.slice(0, 8)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white">{order.user?.name || "Guest"}</div>
                      <div className="text-sm text-slate-400">{order.user?.email || "-"}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-300">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(new Date(order.createdAt), "HH:mm")}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">
                        {formatPrice(Number(order.totalAmount))}
                      </div>
                      <div className={`text-xs ${
                        order.paymentStatus === "PAID" ? "text-green-400" : "text-orange-400"
                      }`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          order.status === "COMPLETED"
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : order.status === "SHIPPED"
                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            : order.status === "PAID"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : order.status === "PENDING"
                            ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                            : order.status === "REFUNDED"
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

