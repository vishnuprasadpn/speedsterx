import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { ProductEditForm } from "@/components/admin/product-edit-form";

export default async function AdminProductEditPage({
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
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Edit Product</h1>
        <p className="text-slate-400">Update product details and manage images</p>
      </div>

      <ProductEditForm 
        product={{
          ...product,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
        }} 
        categories={categories} 
      />
    </div>
  );
}

