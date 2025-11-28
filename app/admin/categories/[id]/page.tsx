import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { CategoryEditForm } from "@/components/admin/category-edit-form";

export default async function AdminCategoryEditPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  // Allow both ADMIN and MANAGER roles
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MANAGER")) {
    redirect("/");
  }

  const params = await paramsPromise;
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: {
      parent: true,
      children: true,
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    notFound();
  }

  // Get all categories for parent selection (exclude self and children to prevent circular references)
  const allCategories = await prisma.category.findMany({
    where: {
      id: { not: category.id },
      parentId: category.parentId ? { not: category.id } : undefined,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Edit Category</h1>
        <p className="text-slate-400">Update category details</p>
      </div>

      <CategoryEditForm category={category} allCategories={allCategories} />
    </div>
  );
}

