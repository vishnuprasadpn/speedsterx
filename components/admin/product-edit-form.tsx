"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Save, 
  X, 
  Upload, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  Loader2,
  Image as ImageIcon,
  Plus
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  isActive: boolean;
  categoryId: string;
  brand: string | null;
  scale: string | null;
  type: string | null;
  motorType: string | null;
  batteryType: string | null;
  terrain: string | null;
  images: ProductImage[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
}

export function ProductEditForm({ product, categories }: ProductEditFormProps) {
  // Validate props
  if (!product) {
    return (
      <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
        Error: Product data not found
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg">
        Warning: No categories available. Please create categories first.
      </div>
    );
  }

  // Get available product types based on category
  const getAvailableTypesForCategory = (categoryId: string): { value: string; label: string }[] => {
    // Find category by ID
    const category = categories.find((c) => c.id === categoryId);
    if (!category) {
      // Return all types if category not found
      return [
        { value: "CRAWLER", label: "Crawler" },
        { value: "DRIFT", label: "Drift" },
        { value: "BUGGY", label: "Buggy" },
        { value: "SHORT_COURSE", label: "Short Course" },
        { value: "MONSTER_TRUCK", label: "Monster Truck" },
        { value: "RALLY", label: "Rally" },
        { value: "TOURING", label: "Touring" },
        { value: "OTHER", label: "Other" },
      ];
    }

    const categorySlug = category.slug.toLowerCase();

    // Map categories to relevant product types
    if (categorySlug.includes("crawler")) {
      // Scale Crawlers, Premium Crawlers
      return [
        { value: "CRAWLER", label: "Crawler" },
        { value: "OTHER", label: "Other" },
      ];
    } else if (categorySlug.includes("construction")) {
      // Construction RC
      return [
        { value: "OTHER", label: "Other" },
      ];
    } else if (categorySlug.includes("micro") || categorySlug.includes("mini")) {
      // Micro RC, Mini RC
      return [
        { value: "CRAWLER", label: "Crawler" },
        { value: "DRIFT", label: "Drift" },
        { value: "TOURING", label: "Touring" },
        { value: "OTHER", label: "Other" },
      ];
    } else if (categorySlug.includes("accessories")) {
      // Accessories
      return [
        { value: "OTHER", label: "Other" },
      ];
    } else if (categorySlug.includes("rc-cars")) {
      // RC Cars (general)
      return [
        { value: "CRAWLER", label: "Crawler" },
        { value: "DRIFT", label: "Drift" },
        { value: "BUGGY", label: "Buggy" },
        { value: "SHORT_COURSE", label: "Short Course" },
        { value: "MONSTER_TRUCK", label: "Monster Truck" },
        { value: "RALLY", label: "Rally" },
        { value: "TOURING", label: "Touring" },
        { value: "OTHER", label: "Other" },
      ];
    }

    // Default: return all types
    return [
      { value: "CRAWLER", label: "Crawler" },
      { value: "DRIFT", label: "Drift" },
      { value: "BUGGY", label: "Buggy" },
      { value: "SHORT_COURSE", label: "Short Course" },
      { value: "MONSTER_TRUCK", label: "Monster Truck" },
      { value: "RALLY", label: "Rally" },
      { value: "TOURING", label: "Touring" },
      { value: "OTHER", label: "Other" },
    ];
  };
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : "",
    stock: product.stock,
    isActive: product.isActive,
    categoryId: product.categoryId,
    brand: product.brand || "",
    scale: product.scale || "",
    type: product.type || "",
    motorType: product.motorType || "",
    batteryType: product.batteryType || "",
    terrain: product.terrain || "",
  });

  const [images, setImages] = useState<ProductImage[]>(product.images);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/products/${product.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update product");
        }

        router.refresh();
        router.push("/admin/products");
      } catch (error: any) {
        setUploadError(error.message || "Failed to update product");
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("images", file);
      });

      const response = await fetch(`/api/admin/products/${product.id}/images`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload images");
      }

      const data = await response.json();
      setImages([...images, ...data.images]);
      router.refresh();
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleImageUrlAdd = async (url: string, altText: string = "") => {
    if (!url.trim()) return;

    setIsUploading(true);
    setUploadError("");

    try {
      const response = await fetch(`/api/admin/products/${product.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), altText: altText.trim() || product.name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add image");
      }

      const data = await response.json();
      setImages([...images, data.image]);
      router.refresh();
    } catch (error: any) {
      setUploadError(error.message || "Failed to add image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await fetch(
        `/api/admin/products/${product.id}/images/${imageId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setImages(images.filter((img) => img.id !== imageId));
      router.refresh();
    } catch (error: any) {
      setUploadError(error.message || "Failed to delete image");
    }
  };

  const handleReorderImage = async (imageId: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const newImages = [...images];
    [newImages[currentIndex], newImages[newIndex]] = [
      newImages[newIndex],
      newImages[currentIndex],
    ];

    // Update sortOrder for all images
    const updatedImages = newImages.map((img, idx) => ({
      ...img,
      sortOrder: idx,
    }));

    try {
      // Update all images with new sort orders
      const updatePromises = updatedImages.map((img, idx) =>
        fetch(`/api/admin/products/${product.id}/images/${img.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sortOrder: idx }),
        })
      );

      await Promise.all(updatePromises);

      setImages(updatedImages);
      router.refresh();
    } catch (error: any) {
      setUploadError(error.message || "Failed to reorder image");
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    if (!confirm("This will permanently delete the product. Are you absolutely sure?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      router.push("/admin/products");
    } catch (error: any) {
      setUploadError(error.message || "Failed to delete product");
    }
  };

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAltText, setImageAltText] = useState("");

  return (
    <div className="space-y-8">
      {uploadError && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {uploadError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Sale Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value ? parseFloat(e.target.value) : "" })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.categoryId}
                      onChange={(e) => {
                        const newCategoryId = e.target.value;
                        // Reset type when category changes if current type is not available for new category
                        const availableTypes = getAvailableTypesForCategory(newCategoryId);
                        const currentType = formData.type;
                        const isTypeAvailable = availableTypes.some(t => t.value === currentType);
                        
                        setFormData({ 
                          ...formData, 
                          categoryId: newCategoryId,
                          type: isTypeAvailable ? currentType : ""
                        });
                      }}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-primary focus:border-primary outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary bg-slate-900 border-slate-700 rounded focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-300">
                    Product is active
                  </label>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-6">Specifications</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Scale
                  </label>
                  <input
                    type="text"
                    value={formData.scale}
                    onChange={(e) => setFormData({ ...formData, scale: e.target.value })}
                    placeholder="e.g., 1/10, 1/18"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Select Type</option>
                    {getAvailableTypesForCategory(formData.categoryId).map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Types available for this category
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Motor Type
                  </label>
                  <select
                    value={formData.motorType}
                    onChange={(e) => setFormData({ ...formData, motorType: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Select Motor Type</option>
                    <option value="BRUSHED">Brushed</option>
                    <option value="BRUSHLESS">Brushless</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Battery Type
                  </label>
                  <select
                    value={formData.batteryType}
                    onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Select Battery Type</option>
                    <option value="NiMH">NiMH</option>
                    <option value="LiPo">LiPo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Terrain
                  </label>
                  <select
                    value={formData.terrain}
                    onChange={(e) => setFormData({ ...formData, terrain: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="">Select Terrain</option>
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Product Images</h2>

              {/* Upload Methods */}
              <div className="space-y-4 mb-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Upload Images
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center justify-center space-x-2 w-full px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 rounded-lg cursor-pointer hover:border-primary transition-colors ${
                        isUploading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                          <span className="text-sm text-slate-300">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-slate-400" />
                          <span className="text-sm text-slate-300">Choose Files</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* URL Input */}
                {!showUrlInput ? (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-sm text-slate-300"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image URL</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Alt text (optional)"
                      value={imageAltText}
                      onChange={(e) => setImageAltText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none text-sm"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (imageUrl.trim()) {
                            handleImageUrlAdd(imageUrl, imageAltText);
                            setImageUrl("");
                            setImageAltText("");
                          }
                        }}
                        disabled={isUploading || !imageUrl.trim()}
                        className="flex-1 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUrlInput(false);
                          setImageUrl("");
                          setImageAltText("");
                        }}
                        className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Images List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {images.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No images yet</p>
                    <p className="text-xs mt-1">Upload or add image URLs</p>
                  </div>
                ) : (
                  images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative group bg-slate-900 border border-slate-700 rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={image.url}
                          alt={image.altText || product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleReorderImage(image.id, "up")}
                            disabled={index === 0}
                            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            <ArrowUp className="h-4 w-4 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorderImage(image.id, "down")}
                            disabled={index === images.length - 1}
                            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            <ArrowDown className="h-4 w-4 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(image.id)}
                            className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="p-2 bg-slate-900/80">
                        <p className="text-xs text-slate-400 truncate">
                          {image.altText || "No alt text"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Order: {image.sortOrder + 1}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-700">
          <button
            type="button"
            onClick={handleDeleteProduct}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete Product</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

