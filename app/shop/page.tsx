import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProductFilters } from "@/components/product-filters";

// Revalidate shop page every 30 seconds
export const revalidate = 30;

interface SearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  scale?: string;
  type?: string;
  page?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const perPage = 12;
  const skip = (page - 1) * perPage;

  // Build where clause - show all active products
  const where: any = { 
    isActive: true,
  };

  // Filter by category if specified
  if (params.category) {
    where.category = { slug: params.category };
  } else {
    // Default: show all products (no category filter)
    // Products can be in any category
  }

  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) {
      where.price.gte = parseFloat(params.minPrice);
    }
    if (params.maxPrice) {
      where.price.lte = parseFloat(params.maxPrice);
    }
  }

  if (params.scale) {
    where.scale = params.scale;
  }

  if (params.type) {
    where.type = params.type;
  }

  // Get accessories category ID and data in parallel
  const [accessoriesCategory, allProducts, total, categories] = await Promise.all([
    prisma.category.findUnique({
      where: { slug: "accessories" },
      select: { id: true },
    }),
    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      // Fetch more to account for sorting (accessories last)
      take: Math.min(perPage * 2, 100), // Limit to prevent huge queries
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      where: { 
        isActive: true,
        parentId: null, // Only show top-level categories
      },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  // Sort products: accessories last, then by createdAt desc
  const sortedProducts = allProducts.sort((a, b) => {
    const aIsAccessory = accessoriesCategory && a.categoryId === accessoriesCategory.id;
    const bIsAccessory = accessoriesCategory && b.categoryId === accessoriesCategory.id;
    
    if (aIsAccessory && !bIsAccessory) return 1; // a goes after b
    if (!aIsAccessory && bIsAccessory) return -1; // a goes before b
    return 0; // Keep original order (already sorted by createdAt desc)
  });

  // Apply pagination after sorting
  const products = sortedProducts.slice(skip, skip + perPage);

  const totalPages = Math.ceil(total / perPage);

  // Helper function to build query string
  const buildQueryString = (pageNum: number) => {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.set('category', params.category);
    if (params.minPrice) queryParams.set('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.set('maxPrice', params.maxPrice);
    if (params.scale) queryParams.set('scale', params.scale);
    if (params.type) queryParams.set('type', params.type);
    queryParams.set('page', pageNum.toString());
    return queryParams.toString();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="relative border-b border-slate-800 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80&fit=crop)"
          }}
        />
        <div className="relative bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/95">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Shop RC Cars & Trucks
              </h1>
              <p className="text-lg text-slate-300 mb-2">
                Discover our premium collection of high-performance remote control vehicles
              </p>
              <p className="text-sm text-slate-400">
                {total} {total === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <ProductFilters categories={categories} searchParams={params as Record<string, string | undefined>} />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-16 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-slate-300 text-lg mb-2">No products found</p>
                <p className="text-slate-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Sort/View Options */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    Showing {products.length} of {total} products
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const price = Number(product.salePrice || product.price);
                    const originalPrice = product.salePrice
                      ? Number(product.price)
                      : null;
                    const discount = originalPrice
                      ? Math.round(((originalPrice - price) / originalPrice) * 100)
                      : 0;

                    return (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="group"
                      >
                        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 card-hover">
                          {/* Image Container */}
                          <div className="relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                            {product.images[0] ? (
                              <>
                                <Image
                                  src={product.images[0].url}
                                  alt={product.images[0].altText || product.name}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <span className="text-sm">No Image</span>
                              </div>
                            )}
                            
                            {/* Discount Badge */}
                            {discount > 0 && (
                              <div className="absolute top-3 right-3 bg-secondary text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                                -{discount}%
                              </div>
                            )}

                            {/* Stock Badge */}
                            {product.stock > 0 && product.stock < 5 && (
                              <div className="absolute top-3 left-3 bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold">
                                Low Stock
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-5">
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                {product.category.name}
                              </span>
                            </div>
                            
                            <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors text-base leading-tight">
                              {product.name}
                            </h3>
                            
                            {product.brand && (
                              <p className="text-xs text-slate-400 mb-3 font-medium">
                                {product.brand}
                              </p>
                            )}

                            {/* Product Specs */}
                            {(product.scale || product.type) && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {product.scale && (
                                  <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
                                    {product.scale}
                                  </span>
                                )}
                                {product.type && (
                                  <span className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded-md">
                                    {product.type.replace('_', ' ')}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Price */}
                            <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                              <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(price)}
                                </span>
                                {originalPrice && (
                                  <span className="text-sm text-slate-500 line-through">
                                    {formatPrice(originalPrice)}
                                  </span>
                                )}
                              </div>
                              {product.stock > 0 ? (
                                <span className="text-xs text-green-400 font-medium">
                                  In Stock
                                </span>
                              ) : (
                                <span className="text-xs text-red-400 font-medium">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center space-x-2">
                    {page > 1 && (
                      <Link
                        href={`/shop?${buildQueryString(page - 1)}`}
                        className="px-4 py-2 border border-slate-700 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-medium text-sm text-slate-300"
                      >
                        ← Previous
                      </Link>
                    )}
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= page - 1 && pageNum <= page + 1)
                        ) {
                          return (
                            <Link
                              key={pageNum}
                              href={`/shop?${buildQueryString(pageNum)}`}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                pageNum === page
                                  ? "bg-primary text-white"
                                  : "border border-slate-700 hover:bg-slate-800 text-slate-300"
                              }`}
                            >
                              {pageNum}
                            </Link>
                          );
                        } else if (pageNum === page - 2 || pageNum === page + 2) {
                          return <span key={pageNum} className="px-2 text-slate-500">...</span>;
                        }
                        return null;
                      })}
                    </div>
                    {page < totalPages && (
                      <Link
                        href={`/shop?${buildQueryString(page + 1)}`}
                        className="px-4 py-2 border border-slate-700 rounded-lg hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-medium text-sm text-slate-300"
                      >
                        Next →
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
