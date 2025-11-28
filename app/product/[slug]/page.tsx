import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      category: true,
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const price = Number(product.salePrice || product.price);
  const originalPrice = product.salePrice ? Number(product.price) : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: "url(https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80&fit=crop)"
        }}
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="aspect-square relative bg-slate-800 rounded-lg overflow-hidden mb-4 border border-slate-700">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500">
                  No Image
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square relative bg-slate-800 rounded-md overflow-hidden border border-slate-700"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-slate-400">{product.category.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">{product.name}</h1>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(price)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-xl text-slate-500 line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-sm font-semibold border border-red-500/30">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-slate-300">
              {product.stock > 0 ? (
                <span className="text-green-400">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-400">Out of Stock</span>
              )}
            </p>
          </div>

          {product.description && (
            <div className="mb-6">
              <h2 className="font-semibold mb-2 text-white">Description</h2>
              <p className="text-slate-300 whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* RC Specifications */}
          <div className="mb-6 border-t border-slate-700 pt-6">
            <h2 className="font-semibold mb-4 text-white">Specifications</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.brand && (
                <div>
                  <span className="text-slate-400">Brand:</span>
                  <span className="ml-2 font-medium text-white">{product.brand}</span>
                </div>
              )}
              {product.scale && (
                <div>
                  <span className="text-slate-400">Scale:</span>
                  <span className="ml-2 font-medium text-white">{product.scale}</span>
                </div>
              )}
              {product.type && (
                <div>
                  <span className="text-slate-400">Type:</span>
                  <span className="ml-2 font-medium text-white">{product.type.replace("_", " ")}</span>
                </div>
              )}
              {product.motorType && (
                <div>
                  <span className="text-slate-400">Motor:</span>
                  <span className="ml-2 font-medium text-white">{product.motorType}</span>
                </div>
              )}
              {product.batteryType && (
                <div>
                  <span className="text-slate-400">Battery:</span>
                  <span className="ml-2 font-medium text-white">{product.batteryType}</span>
                </div>
              )}
              {product.terrain && (
                <div>
                  <span className="text-slate-400">Terrain:</span>
                  <span className="ml-2 font-medium text-white">{product.terrain}</span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="border-t border-slate-700 pt-6">
            <AddToCartButton productId={product.id} disabled={product.stock === 0} />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

