"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Menu, LayoutGrid, Boxes, Users, ListChecks, Settings } from "lucide-react"
import { useState } from "react"

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/queries", label: "Queries", icon: ListChecks },
  { href: "/admin/landing-pages", label: "Landing Pages", icon: ListChecks }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-md border bg-white px-3 py-2 shadow-sm"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>
      <aside
        className={cn(
          "z-40 w-64 shrink-0 border-r bg-white md:static md:translate-x-0 md:block",
          "fixed inset-y-0 left-0 transform transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="h-8 w-8 rounded bg-[#2c1810]" />
          <span className="font-semibold tracking-tight">Nuvinty</span>
        </div>
        <nav className="space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                  active
                    ? "bg-[#2c1810] text-white"
                    : "text-[#2c1810] hover:bg-[#f3f2ef]"
                )}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}


