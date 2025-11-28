import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Users, Shield, UserCog, Edit, Trash2 } from "lucide-react";
import { canManageAdmins } from "@/lib/admin-permissions";
import { UsersList } from "@/components/admin/users-list";

export default async function AdminUsersPage() {
  const session = await auth();

  // Only primary ADMIN can access this page
  if (!session || !canManageAdmins(session.user.role)) {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
        },
      },
    },
  });

  const roleCounts = {
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
    MANAGER: users.filter((u) => u.role === "MANAGER").length,
    CUSTOMER: users.filter((u) => u.role === "CUSTOMER").length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
            <p className="text-slate-400">Manage admin and customer accounts</p>
          </div>
          <Link
            href="/admin/users/new"
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Add User</span>
          </Link>
        </div>
        <div className="flex items-center space-x-6 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{users.length} {users.length === 1 ? 'user' : 'users'}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium border border-red-500/30">
              {roleCounts.ADMIN} Admin
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
              {roleCounts.MANAGER} Manager
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
              {roleCounts.CUSTOMER} Customer
            </span>
          </div>
        </div>
      </div>

      <UsersList users={users} />
    </div>
  );
}

