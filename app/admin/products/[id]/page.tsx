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
  try {
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

    // Convert Decimal to number for client components
    const productForClient = {
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
    };

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Edit Product</h1>
          <p className="text-slate-400">Update product details and manage images</p>
        </div>

        <ProductEditForm 
          product={productForClient} 
          categories={categories} 
        />
      </div>
    );
  } catch (error: any) {
    console.error("Product edit page error:", error);
    return (
      <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
        <h2 className="font-bold mb-2">Error loading product</h2>
        <p>{error.message || "An unexpected error occurred"}</p>
      </div>
    );
  }
}

