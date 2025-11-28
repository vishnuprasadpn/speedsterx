"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Package, Edit, Eye } from "lucide-react";
import { ProductSearchFilters } from "./product-search-filters";

interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  category: { name: string; slug: string };
  price: number;
  salePrice: number | null;
  stock: number;
  isActive: boolean;
  images: { url: string }[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsListProps {
  products: Product[];
  categories: Category[];
}

export function ProductsList({ products, categories }: ProductsListProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  return (
    <>
      <ProductSearchFilters
        products={products}
        categories={categories}
        onFiltered={(filtered) => setFilteredProducts(filtered)}
      />

      {/* Products Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        {filteredProducts.length === 0 ? (
          <div className="p-16 text-center">
            <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/50 border-b border-slate-700">
                <tr>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Product</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Price</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Stock</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-4">
                        {product.images[0] ? (
                          <div className="w-16 h-16 relative bg-slate-700 rounded-lg overflow-hidden border border-slate-600 flex-shrink-0">
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-slate-700 rounded-lg border border-slate-600 flex items-center justify-center flex-shrink-0">
                            <Package className="h-6 w-6 text-slate-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="font-semibold text-white hover:text-primary transition-colors block truncate"
                          >
                            {product.name}
                          </Link>
                          {product.brand && (
                            <p className="text-sm text-slate-400 mt-1">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300">{product.category.name}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        {product.salePrice ? (
                          <>
                            <span className="font-bold text-primary">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-sm text-slate-500 line-through">
                              {formatPrice(Number(product.price))}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-white">
                            {formatPrice(Number(product.price))}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-semibold ${
                          product.stock < 5
                            ? "text-red-400"
                            : product.stock < 10
                            ? "text-orange-400"
                            : "text-green-400"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                          product.isActive
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-slate-700 text-slate-400 border border-slate-600"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-slate-400 hover:text-primary transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
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

