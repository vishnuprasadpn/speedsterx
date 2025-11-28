import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FolderTree, Edit } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true, children: true },
      },
      parent: true,
    },
    orderBy: { name: "asc" },
  });

  const topLevelCategories = categories.filter((c) => !c.parentId);
  const childCategories = categories.filter((c) => c.parentId);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Categories</h1>
            <p className="text-slate-400">Organize your product categories</p>
          </div>
          <Link
            href="/admin/categories/new"
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Add Category</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <FolderTree className="h-4 w-4" />
            <span>{categories.length} {categories.length === 1 ? 'category' : 'categories'}</span>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {topLevelCategories.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-16 text-center">
            <FolderTree className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No categories yet</h3>
            <p className="text-slate-400 mb-6">Create your first category to organize products</p>
            <Link
              href="/admin/categories/new"
              className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>Add Your First Category</span>
            </Link>
          </div>
        ) : (
          topLevelCategories.map((category) => {
            const children = childCategories.filter((c) => c.parentId === category.id);
            return (
              <div
                key={category.id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/20 rounded-lg">
                      <FolderTree className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-slate-400 mt-1">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Products</p>
                      <p className="text-lg font-semibold text-white">
                        {category._count.products}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Subcategories</p>
                      <p className="text-lg font-semibold text-white">
                        {category._count.children}
                      </p>
                    </div>
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                      title="Edit Category"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
                {children.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-sm text-slate-400 mb-3">Subcategories:</p>
                    <div className="flex flex-wrap gap-2">
                      {children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/admin/categories/${child.id}`}
                          className="px-3 py-1.5 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-900 hover:border-primary/50 hover:text-primary transition-all"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

