"use client";

import type React from "react";
import {
  FileBarChart,
  BookOpen,
  Users,
  FileCheck,
  X,
  ChevronDown,
  House,
  Diff,
  Blend,
  ChartNoAxesColumnIncreasing,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface NavigationItem {
  id: string | null;
  icon: React.ElementType;
  label: string;
  count?: number;
  color?: string;
  href: string;
  children?: NavigationItem[];
  disabled?: boolean;
}

interface SidebarNavigationProps {
  className?: string;
  onNavigate: (id: string | null) => void;
  activeItem?: string | null;
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarNavigation({
  className,
  onNavigate,
  activeItem,
  isOpen,
  onToggle,
}: SidebarNavigationProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["policy-intelligence"])
  );
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const quickNavItems: NavigationItem[] = [
    {
      id: "summary",
      icon: House,
      label: "Summary",
      color: "text-[#f087fb]",
      href: "/summary",
    },
    {
      id: "policy-intelligence",
      icon: FileBarChart,
      label: "Policy Intelligence",
      color: "text-blue-600",
      href: "#",
      children: [
        {
          id: null,
          icon: FileBarChart,
          label: "Overview",
          color: "text-blue-600",
          href: "/dashboard",
        },
        {
          id: "bookmarked",
          icon: Users,
          label: "Payer Analysis",
          color: "text-blue-600",
          href: "/payer-analysis",
        },
        {
          id: "all-policies",
          icon: BookOpen,
          label: "Policy Explorer",
          color: "text-blue-600",
          href: "/policy-explorer",
        },
        {
          id: "code-coverage",
          icon: FileCheck,
          label: "Code Coverage",
          color: "text-blue-600",
          href: "/code-coverage",
        },
        {
          id: "lcd-mcd-coverage",
          icon: ChartNoAxesColumnIncreasing,
          label: "LCD / MCD Coverage",
          color: "text-blue-600",
          href: "/lcd-mcd-coverage",
        },
        {
          id: "service-comparison",
          icon: Diff,
          label: "Service Comparison",
          color: "text-blue-600",
          href: "/service-comparison",
        },
      ],
    },
    {
      id: "claim-repricer",
      icon: FileCheck,
      label: "Claim Repricer",
      color: "text-green-600",
      href: "#",
      children: [
        {
          id: "repricer-dashboard",
          icon: FileBarChart,
          label: "Repricer Intelligence Dashboard",
          color: "text-green-600",
          href: "https://reprice-dashboard.vercel.app/",
        },
        {
          id: "claims-process",
          icon: FileCheck,
          label: "Claims Process Summary",
          color: "text-green-600",
          href: "https://reprice-dashboard.vercel.app/claims-process",
        },
      ],
    },
    {
      id: "payment-leakage",
      icon: Users,
      label: "Payment Leakage",
      color: "text-orange-600",
      href: "#",
      children: [
        {
          id: "leakage-overview",
          icon: FileBarChart,
          label: "Overview",
          color: "text-orange-600",
          href: "https://payment-leakage.vercel.app/",
        },
        {
          id: "data-ingestion",
          icon: FileCheck,
          label: "Data Ingestion",
          color: "text-orange-600",
          href: "https://payment-leakage.vercel.app/data-ingestion",
        },
        {
          id: "diagnosis-configuration",
          icon: BookOpen,
          label: "Edits and Configuration",
          color: "text-orange-600",
          href: "https://payment-leakage.vercel.app/diagnosis-configuration",
        },
        {
          id: "file-config-status",
          icon: FileCheck,
          label: "File & Config Status",
          color: "text-orange-600",
          href: "https://payment-leakage.vercel.app/file-config-status",
        },
        {
          id: "claims-management",
          icon: Users,
          label: "Claims Management",
          color: "text-orange-600",
          href: "https://payment-leakage.vercel.app/claims-management",
        },
      ],
    },
    {
      id: "raise-transparency",
      icon: Blend,
      label: "Price Transparency Intelligence",
      color: "text-[#66348f]",
      href: "",
      disabled: true,
    },
    {
      id: "contract-intelligence",
      icon: BookOpen,
      label: "Contract Intelligence",
      color: "text-[#9c5d45]",
      href: "",
      disabled: true,
    },
  ];

  const handleNavigate = (href: string, itemId?: string | null) => {
    if (href !== "#") {
      // Check if it's an external link
      router.push(href);

      // If Summary is clicked, collapse all other menus
      if (itemId === "summary") {
        setExpandedCategories(new Set());
      }

      if (isMobile) {
        onToggle(); // Close mobile menu after navigation
      }
    }
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href;
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories.has(categoryId);
  };

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onToggle}
          />
        )}

        {/* Mobile Sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 h-full w-64 z-50 font-title transform transition-transform duration-300 ease-in-out",
            "bg-[#F5F5F5] shadow-[3px_0px_25px_0px_rgba(0,0,0,0.15)]",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className
          )}
        >
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="p-2">
            <nav className="mt-2 space-y-1">
              {quickNavItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = hasChildren
                  ? isCategoryExpanded(item.id!)
                  : false;

                return (
                  <div key={item.id || "overview"}>
                    <button
                      onClick={() => {
                        if (hasChildren) {
                          toggleCategory(item.id!);
                        } else {
                          handleNavigate(item.href, item.id || null);
                        }
                      }}
                      className={cn(
                        "flex w-full items-center rounded-full px-2 py-4 my-1 text-sm font-bold text-left transition-all duration-200 no-shadow",
                        item.disabled &&
                          "opacity-50 cursor-not-allowed hover:bg-transparent",
                        hasChildren
                          ? "text-gray-700 hover:bg-white"
                          : isActive(item.href)
                          ? "bg-gradient-to-r from-[#449CFB] to-[#E85DF9] text-white"
                          : "text-gray-700 hover:bg-white"
                      )}
                      disabled={item.disabled}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 no-shadow",
                          hasChildren
                            ? item.color
                            : isActive(item.href)
                            ? "text-white"
                            : item.color
                        )}
                      />
                      <span className="flex-1">{item.label}</span>
                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded ? "rotate-180" : ""
                          )}
                        />
                      )}
                      {item.count && (
                        <span
                          className={cn(
                            "ml-2 rounded-full text-xs",
                            isActive(item.href)
                              ? "text-white"
                              : "text-slate-500"
                          )}
                        >
                          ({item.count})
                        </span>
                      )}
                    </button>

                    {hasChildren && isExpanded && (
                      <div className="ml-2 space-y-1">
                        {item.children!.map((child) => {
                          const childActive = isActive(child.href);
                          return (
                            <button
                              key={child.id || "child-overview"}
                              onClick={() =>
                                handleNavigate(child.href, child.id || null)
                              }
                              className={cn(
                                "flex w-full items-center rounded-full px-4 py-3 my-1 text-sm font-medium text-left transition-all duration-200 no-shadow",
                                childActive
                                  ? "bg-gradient-to-r from-[#449CFB] to-[#E85DF9] text-white"
                                  : "text-gray-600 hover:bg-white"
                              )}
                              disabled={item.disabled}
                            >
                              <child.icon
                                className={cn(
                                  "mr-3 h-4 w-4 no-shadow",
                                  childActive ? "text-white" : child.color
                                )}
                              />
                              <span className="flex-1">{child.label}</span>
                              {child.count && (
                                <span
                                  className={cn(
                                    "ml-2 rounded-full text-xs",
                                    childActive
                                      ? "text-white"
                                      : "text-slate-500"
                                  )}
                                >
                                  ({child.count})
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar (unchanged)
  return (
    <div
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-5rem)] w-64 z-10 font-title",
        "bg-[#F5F5F5] shadow-[3px_0px_25px_0px_rgba(0,0,0,0.15)]",
        className
      )}
    >
      <div className="p-2">
        <nav className="mt-2 space-y-1">
          {quickNavItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = hasChildren
              ? isCategoryExpanded(item.id!)
              : false;

            return (
              <div key={item.id || "overview"}>
                <button
                  onClick={() => {
                    if (hasChildren) {
                      toggleCategory(item.id!);
                    } else {
                      handleNavigate(item.href, item.id || null);
                    }
                  }}
                  className={cn(
                    "flex w-full items-center rounded-full px-3 py-4 my-2 text-md font-semibold text-left transition-all duration-200 no-shadow",
                    hasChildren
                      ? "text-gray-700 hover:bg-white"
                      : isActive(item.href)
                      ? "bg-gradient-to-r from-[#449CFB] to-[#E85DF9] text-white"
                      : "text-gray-700 hover:bg-white",
                    item.disabled && "opacity-60 hover:bg-transparent"
                  )}
                  disabled={item.disabled}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 no-shadow",
                      hasChildren
                        ? item.color
                        : isActive(item.href)
                        ? "text-white"
                        : item.color
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isExpanded ? "rotate-180" : ""
                      )}
                    />
                  )}
                  {item.count && (
                    <span
                      className={cn(
                        "ml-2 rounded-full text-xs",
                        isActive(item.href) ? "text-white" : "text-slate-500"
                      )}
                    >
                      ({item.count})
                    </span>
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="ml-2 space-y-1">
                    {item.children!.map((child) => {
                      const childActive = isActive(child.href);
                      return (
                        <button
                          key={child.id || "child-overview"}
                          onClick={() =>
                            handleNavigate(child.href, child.id || null)
                          }
                          className={cn(
                            "flex w-full items-center rounded-full px-4 py-3 my-1 text-sm font-medium text-left transition-all duration-200 no-shadow",
                            childActive
                              ? "bg-gradient-to-r from-[#449CFB] to-[#E85DF9] text-white"
                              : "text-gray-600 hover:bg-white"
                          )}
                        >
                          <child.icon
                            className={cn(
                              "mr-3 h-4 w-4 no-shadow",
                              childActive ? "text-white" : child.color
                            )}
                          />
                          <span className="flex-1">{child.label}</span>
                          {child.count && (
                            <span
                              className={cn(
                                "ml-2 rounded-full text-xs",
                                childActive ? "text-white" : "text-slate-500"
                              )}
                            >
                              ({child.count})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="text-center text-xs text-orange-400 border-t border-gray-200 pt-6">
          Illustrative sample data for presentation purposes only.
        </div>
      </div>
    </div>
  );
}
