import type { ReactNode } from "react"
import Sidebar from "@/components/admin/Sidebar"
import Topbar from "@/components/admin/Topbar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#1f1f1f]">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}


