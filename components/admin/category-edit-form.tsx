"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, X, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  parentId: string | null;
  parent: { id: string; name: string } | null;
  children: { id: string }[];
  _count: { products: number };
}

interface CategoryEditFormProps {
  category: Category;
  allCategories: { id: string; name: string; slug: string }[];
}

export function CategoryEditForm({ category, allCategories }: CategoryEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    isActive: category.isActive,
    parentId: category.parentId || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/categories/${category.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            parentId: formData.parentId || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update category");
        }

        router.refresh();
        router.push("/admin/categories");
      } catch (error: any) {
        setError(error.message || "Failed to update category");
      }
    });
  };

  // Generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Warning if category has products */}
      {category._count.products > 0 && (
        <div className="mb-6 bg-orange-500/20 border border-orange-500/30 text-orange-400 px-4 py-3 rounded-lg">
          <p className="font-medium">Warning: This category has {category._count.products} product(s).</p>
          <p className="text-sm mt-1">Changing the category may affect product listings.</p>
        </div>
      )}

      {/* Warning if category has children */}
      {category.children.length > 0 && (
        <div className="mb-6 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg">
          <p className="font-medium">This category has {category.children.length} subcategory(ies).</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Slug *
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-primary focus:border-primary outline-none"
            pattern="[a-z0-9-]+"
            title="Slug must contain only lowercase letters, numbers, and hyphens"
          />
          <p className="text-xs text-slate-500 mt-1">
            URL-friendly identifier (lowercase, numbers, and hyphens only)
          </p>
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

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Parent Category
          </label>
          <select
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-primary focus:border-primary outline-none"
          >
            <option value="">None (Top-level category)</option>
            {allCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {category.parent && (
            <p className="text-xs text-slate-500 mt-1">
              Current parent: {category.parent.name}
            </p>
          )}
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
            Category is active
          </label>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-slate-700">
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
      </form>
    </div>
  );
}

