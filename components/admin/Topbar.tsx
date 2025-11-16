"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export default function Topbar() {
  const [query, setQuery] = useState("")
  const [dark, setDark] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white/80 px-4 backdrop-blur md:px-6">
      <h1 className="ml-auto text-base font-semibold">Hy Admin</h1>
    </header>
  )
}


