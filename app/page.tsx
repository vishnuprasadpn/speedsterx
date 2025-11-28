import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { HeroCarousel } from "@/components/hero-carousel";

// Revalidate homepage every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  try {
    // Get accessories category ID and products in parallel
    const [accessoriesCategory, allProducts] = await Promise.all([
      prisma.category.findUnique({
        where: { slug: "accessories" },
        select: { id: true },
      }),
      // Limit to 20 products for homepage (enough for featured + special)
      prisma.product.findMany({
        where: { isActive: true },
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
        take: 20, // Limit to improve performance
      }),
    ]);

  // Sort: accessories last
  const sortedProducts = allProducts.sort((a, b) => {
    const aIsAccessory = accessoriesCategory && a.categoryId === accessoriesCategory.id;
    const bIsAccessory = accessoriesCategory && b.categoryId === accessoriesCategory.id;
    if (aIsAccessory && !bIsAccessory) return 1;
    if (!aIsAccessory && bIsAccessory) return -1;
    return 0;
  });

  const thisWeeksSpecial = sortedProducts.length > 0 
    ? (sortedProducts.find(p => 
        accessoriesCategory && p.categoryId !== accessoriesCategory.id
      ) || sortedProducts[0])
    : null;

  // Fetch featured products (excluding accessories, max 8)
  const featuredProducts = sortedProducts
    .filter(p => !accessoriesCategory || p.categoryId !== accessoriesCategory.id)
    .slice(0, 8);


  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Carousel Section */}
      <section className="mb-12 w-full relative">
        <HeroCarousel />
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* This Week's Special */}
        {thisWeeksSpecial && (
          <section className="mb-16">
            <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                  backgroundSize: '40px 40px'
                }}></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10">
                {/* Left Side - Full Covering Image with Overlay */}
                <div className="relative h-full min-h-[350px] lg:min-h-[450px] bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden group">
                  {thisWeeksSpecial.images[0] ? (
                    <>
                      <Image
                        src={thisWeeksSpecial.images[0].url}
                        alt={thisWeeksSpecial.images[0].altText || thisWeeksSpecial.name}
                        fill
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-slate-900/20 to-transparent pointer-events-none"></div>
                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                  
                  {/* Floating Badge on Image */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center px-3 py-1.5 bg-primary/90 backdrop-blur-sm text-white rounded-full text-xs font-bold shadow-lg border border-primary/50">
                      ⭐ This Week's Special
                    </span>
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-slate-800/95 via-slate-800 to-slate-900/95 backdrop-blur-sm relative min-h-[350px] lg:min-h-[450px]">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs font-medium border border-slate-600/50 backdrop-blur-sm">
                        {thisWeeksSpecial.category.name}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight tracking-tight">
                      {thisWeeksSpecial.name}
                    </h2>

                    {/* Brand */}
                    {thisWeeksSpecial.brand && (
                      <p className="text-sm text-slate-400 mb-4 font-medium">
                        by {thisWeeksSpecial.brand}
                      </p>
                    )}

                    {/* Description */}
                    {thisWeeksSpecial.description && (
                      <p className="text-sm text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                        {thisWeeksSpecial.description.substring(0, 180)}
                        {thisWeeksSpecial.description.length > 180 && "..."}
                      </p>
                    )}

                    {/* Product Specs - Compact Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {thisWeeksSpecial.scale && (
                        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 hover:border-primary/30 transition-colors">
                          <p className="text-xs text-slate-400 mb-1 font-medium">Scale</p>
                          <p className="text-sm font-bold text-white">{thisWeeksSpecial.scale}</p>
                        </div>
                      )}
                      {thisWeeksSpecial.type && (
                        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 hover:border-primary/30 transition-colors">
                          <p className="text-xs text-slate-400 mb-1 font-medium">Type</p>
                          <p className="text-sm font-bold text-white">
                            {thisWeeksSpecial.type.replace("_", " ")}
                          </p>
                        </div>
                      )}
                      {thisWeeksSpecial.motorType && (
                        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 hover:border-primary/30 transition-colors">
                          <p className="text-xs text-slate-400 mb-1 font-medium">Motor</p>
                          <p className="text-sm font-bold text-white">{thisWeeksSpecial.motorType}</p>
                        </div>
                      )}
                      {thisWeeksSpecial.terrain && (
                        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 hover:border-primary/30 transition-colors">
                          <p className="text-xs text-slate-400 mb-1 font-medium">Terrain</p>
                          <p className="text-sm font-bold text-white">{thisWeeksSpecial.terrain}</p>
                        </div>
                      )}
                    </div>

                    {/* Price and Stock Section */}
                    <div className="mb-6 pb-6 border-b border-slate-700/50">
                      <div className="flex items-baseline space-x-3 mb-2">
                        <span className="text-3xl font-bold text-primary">
                          {formatPrice(Number(thisWeeksSpecial.salePrice || thisWeeksSpecial.price))}
                        </span>
                        {thisWeeksSpecial.salePrice && (
                          <>
                            <span className="text-base text-slate-500 line-through">
                              {formatPrice(Number(thisWeeksSpecial.price))}
                            </span>
                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-bold border border-red-500/30">
                              SALE
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          thisWeeksSpecial.stock > 0 ? "bg-green-400" : "bg-red-400"
                        }`}></div>
                        <p className={`text-xs font-medium ${
                          thisWeeksSpecial.stock > 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          {thisWeeksSpecial.stock > 0 
                            ? `${thisWeeksSpecial.stock} in stock` 
                            : "Out of stock"}
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/product/${thisWeeksSpecial.slug}`}
                      className="group inline-flex items-center justify-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transform relative overflow-hidden"
                    >
                      <span className="relative z-10">View Full Details</span>
                      <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
              Featured Products
            </h2>
            <div className="section-divider"></div>
          </div>
          <Link
            href="/shop"
            className="text-primary hover:text-primary/80 font-medium transition-colors text-sm"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
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
                <div className="relative border border-slate-700 rounded-lg overflow-hidden bg-slate-800 card-hover">
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 right-3 z-20 bg-secondary text-white px-2 py-1 rounded-md font-semibold text-xs">
                      -{discount}%
                    </div>
                  )}
                  
                  <div className="aspect-square relative bg-slate-700 overflow-hidden">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].altText || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 bg-slate-700">
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-1">
                      <span className="text-xs text-slate-400 uppercase tracking-wide">
                        {product.category.name}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1.5 line-clamp-2 group-hover:text-primary transition-colors text-sm">
                      {product.name}
                    </h3>
                    {product.brand && (
                      <p className="text-xs text-slate-400 mb-2">
                        {product.brand}
                      </p>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold text-primary">
                        {formatPrice(price)}
                      </span>
                      {originalPrice && (
                        <span className="text-xs text-slate-500 line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      </div>
    </div>
  );
  } catch (error: any) {
    console.error("Homepage error:", error);
    // Return a fallback page if there's an error
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
          <p className="text-slate-400">Please try again later.</p>
        </div>
      </div>
    );
  }
}

