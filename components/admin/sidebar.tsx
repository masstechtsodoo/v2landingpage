"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ExternalLink, Inbox, KeyRound, LayoutDashboard, LogOut, Menu, Newspaper, Package, X } from "lucide-react";
import { Logo } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Хянах самбар", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Бүтээгдэхүүн", icon: Package },
  { href: "/admin/news", label: "Мэдээ, төслүүд", icon: Newspaper },
  { href: "/admin/messages", label: "Зурвасууд", icon: Inbox },
  { href: "/admin/settings", label: "Нууц үг солих", icon: KeyRound },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  const links = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-[0.6rem] px-3 py-2.5 text-[0.95rem] transition-colors",
              active ? "bg-white/15 text-white" : "text-white/65 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon className="size-[18px]" strokeWidth={1.8} />
            {label}
          </Link>
        );
      })}
      <div className="mt-auto space-y-1 border-t border-white/10 pt-3">
        <a href="/mn" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[0.6rem] px-3 py-2.5 text-[0.95rem] text-white/65 hover:bg-white/10 hover:text-white">
          <ExternalLink className="size-[18px]" strokeWidth={1.8} /> Сайт руу
        </a>
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-[0.6rem] px-3 py-2.5 text-[0.95rem] text-white/65 hover:bg-white/10 hover:text-white">
          <LogOut className="size-[18px]" strokeWidth={1.8} /> Гарах
        </button>
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-ink px-4 py-3 lg:hidden">
        <Logo />
        <button type="button" onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-[0.6rem] bg-white/10 text-white" aria-label="Menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-ink lg:hidden">{links}</div>}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-[100svh] w-64 shrink-0 flex-col bg-ink lg:flex">
        <div className="px-5 pt-6 pb-4">
          <Logo />
          <p className="mt-2 text-xs tracking-wide text-white/40 uppercase">Admin</p>
        </div>
        {links}
      </aside>
    </>
  );
}
