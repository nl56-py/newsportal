import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-1.5 text-xs text-slate-500 font-mukta py-2 overflow-x-auto no-scrollbar"
    >
      <Link
        href="/"
        className="flex items-center hover:text-brand-red transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>गृहपृष्ठ</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            {isLast || !item.url ? (
              <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-md">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.url}
                className="hover:text-brand-red transition-colors truncate"
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
