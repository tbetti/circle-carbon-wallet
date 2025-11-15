"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { label: "🏠 Home", path: "/" },
    { label: "💱 Transfer", path: "/transfer" },
    { label: "🛒 Marketplace", path: "/marketplace" },
    { label: "🌍 Emissions", path: "/emissions" },
  ];

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white hover:text-green-400 transition">
            🌱 Carbon Bridge
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`rounded-md transition-all ${
                    isActive(item.path)
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "text-gray-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Connected: Testnet</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
