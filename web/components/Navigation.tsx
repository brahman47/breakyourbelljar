"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Reflections", href: "/reflections" },
  { label: "Opinions", href: "/opinions" },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 mx-auto flex w-full justify-center bg-white/50 backdrop-blur">
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-8">
        <div className="relative flex items-center justify-between gap-6 rounded-full border border-white/40 bg-white/80 px-4 py-3 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)]">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-light text-gray-900 transition hover:text-amber-600"
          >
            <Image src="/bybj.png" alt="Break Your Bell Jar" width={36} height={36} className="rounded-xl" />
            <span>
              Break Your <span className="font-serif italic">Bell Jar</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1 rounded-full border border-gray-200/70 bg-white/70 p-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative overflow-hidden rounded-full px-4 py-2 text-sm font-light text-gray-600 transition-colors",
                      active && "text-gray-900"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-[0_8px_20px_-12px_rgba(15,23,42,0.4)]"
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full border border-gray-200/80 bg-white/80 p-2 text-gray-600 transition hover:text-amber-600 md:hidden"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-gray-950/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              className="fixed top-4 right-4 z-50 flex h-[90vh] w-72 flex-col rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.3em] text-gray-400">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-gray-200/80 p-2 text-gray-500 transition hover:text-amber-600"
                  aria-label="Close navigation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 flex flex-col gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "text-lg font-light text-gray-700 transition hover:text-amber-600",
                      isActive(item.href) && "text-gray-900"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto rounded-2xl border border-gray-200/80 bg-white/70 p-4 text-center text-sm text-gray-500">
                Break Your Bell Jar
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
