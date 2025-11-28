"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { FileText, Edit, Eye, Trash2, Loader2 } from "lucide-react";
import { PageSearchFilters } from "./page-search-filters";

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
}

interface PagesListProps {
  pages: Page[];
}

export function PagesList({ pages }: PagesListProps) {
  const router = useRouter();
  const [filteredPages, setFilteredPages] = useState<Page[]>(pages);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const handleDelete = async (pageId: string, pageTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${pageTitle}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(pageId);
    setError("");

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete page");
      }

      // Remove from filtered list
      setFilteredPages(filteredPages.filter((p) => p.id !== pageId));
      
      // Refresh the page to update the server-side data
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to delete page");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      <PageSearchFilters pages={pages} onFiltered={setFilteredPages} />

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.length === 0 ? (
          <div className="col-span-full bg-slate-800 border border-slate-700 rounded-xl p-16 text-center">
            <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No pages found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredPages.map((page) => (
            <div
              key={page.id}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/20 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    page.isPublished
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-slate-700 text-slate-400 border border-slate-600"
                  }`}
                >
                  {page.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{page.title}</h3>
              <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                {page.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                <div className="text-xs text-slate-500">
                  {format(new Date(page.createdAt), "MMM d, yyyy")}
                </div>
                <div className="flex items-center space-x-2">
                  {page.isPublished && (
                    <Link
                      href={`/page/${page.slug}`}
                      target="_blank"
                      className="p-2 text-slate-400 hover:text-primary transition-colors"
                      title="View Page"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  )}
                  <Link
                    href={`/admin/pages/${page.id}`}
                    className="p-2 text-slate-400 hover:text-primary transition-colors"
                    title="Edit Page"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id, page.title)}
                    disabled={deletingId === page.id}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Page"
                  >
                    {deletingId === page.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

