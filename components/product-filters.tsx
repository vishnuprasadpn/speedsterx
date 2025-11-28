"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";
import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";

interface CategoryWithChildren extends Category {
  children?: Category[];
}

interface ProductFiltersProps {
  categories: CategoryWithChildren[];
  searchParams: Record<string, string | undefined>;
}

export function ProductFilters({ categories, searchParams }: ProductFiltersProps) {
  const router = useRouter();
  const currentParams = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.category || "",
    minPrice: searchParams.minPrice || "",
    maxPrice: searchParams.maxPrice || "",
    scale: searchParams.scale || "",
    type: searchParams.type || "",
  });

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.scale || filters.type;

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      scale: "",
      type: "",
    });
    router.push("/shop");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg text-white">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2.5 text-white">
          Category
        </label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="w-full border border-slate-600 bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => {
              if (cat.children && cat.children.length > 0) {
                return (
                  <optgroup key={cat.id} label={cat.name}>
                    {cat.children.map((child) => (
                      <option key={child.id} value={child.slug}>
                        {child.name}
                      </option>
                    ))}
                  </optgroup>
                );
              }
              return (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              );
            })}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold mb-2.5 text-white">
          Price Range
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Minimum (₹)
            </label>
            <input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="w-full border border-slate-600 bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">
              Maximum (₹)
            </label>
            <input
              type="number"
              placeholder="100,000"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="w-full border border-slate-600 bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Scale Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2.5 text-white">
          Scale
        </label>
        <div className="relative">
          <select
            value={filters.scale}
            onChange={(e) => setFilters({ ...filters, scale: e.target.value })}
            className="w-full border border-slate-600 bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="">All Scales</option>
            <option value="1/10">1/10 Scale</option>
            <option value="1/12">1/12 Scale</option>
            <option value="1/14">1/14 Scale</option>
            <option value="1/16">1/16 Scale</option>
            <option value="1/18">1/18 Scale</option>
            <option value="1/24">1/24 Scale</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <label className="block text-sm font-semibold mb-2.5 text-white">
          Vehicle Type
        </label>
        <div className="relative">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full border border-slate-600 bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="CRAWLER">Crawler</option>
            <option value="DRIFT">Drift</option>
            <option value="BUGGY">Buggy</option>
            <option value="SHORT_COURSE">Short Course</option>
            <option value="MONSTER_TRUCK">Monster Truck</option>
            <option value="RALLY">Rally</option>
            <option value="TOURING">Touring</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Apply Button */}
      <div className="pt-4 border-t border-slate-700">
        <button
          onClick={applyFilters}
          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply Filters
        </button>
      </div>
      </div>
    </div>
  );
}

