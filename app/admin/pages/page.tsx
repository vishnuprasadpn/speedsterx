import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { PagesList } from "@/components/admin/pages-list";

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">CMS Pages</h1>
            <p className="text-slate-400">Manage your content pages</p>
          </div>
          <Link
            href="/admin/pages/new"
            className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="h-5 w-5" />
            <span>Add Page</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{pages.length} {pages.length === 1 ? 'page' : 'pages'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>{pages.filter(p => p.isPublished).length} published</span>
          </div>
        </div>
      </div>

      <PagesList pages={pages} />
    </div>
  );
}

