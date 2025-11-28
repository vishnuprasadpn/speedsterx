import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { ProductsList } from "@/components/admin/products-list";

export default async function AdminProductsPage() {
  // Get accessories category ID
  const accessoriesCategory = await prisma.category.findUnique({
    where: { slug: "accessories" },
    select: { id: true },
  });

  const allProducts = await prisma.product.findMany({
    include: {
      category: true,
      images: {
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Sort: accessories last
  const products = allProducts.sort((a, b) => {
    const aIsAccessory = accessoriesCategory && a.categoryId === accessoriesCategory.id;
    const bIsAccessory = accessoriesCategory && b.categoryId === accessoriesCategory.id;
    if (aIsAccessory && !bIsAccessory) return 1;
    if (!aIsAccessory && bIsAccessory) return -1;
    return 0;
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  // Convert Decimal to number for client components
  const productsForClient = products.map((product) => ({
    ...product,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
            <p className="text-slate-400">Manage your product catalog</p>
          </div>
          <Link
            href="/admin/products/new"
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Add Product</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>{products.length} {products.length === 1 ? 'product' : 'products'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>{products.filter(p => p.isActive).length} active</span>
          </div>
        </div>
      </div>

      <ProductsList products={productsForClient} categories={categories} />
    </div>
  );
}

