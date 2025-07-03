"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Search, ShoppingBag, Menu, X, MoreHorizontal, Heart } from "lucide-react"
import Link from "next/link"
import AuthModal from "./auth-modal"
import { handleGetUser } from "@/helper/general"

interface LayoutProps {
  children: React.ReactNode
  handleSearch?: (search: string) => void
}

export default function Layout({ children, handleSearch }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "signup" }>({
    isOpen: false,
    mode: "login",
  })
  const [productSearch, setProductSearch] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  useEffect(() => {
    const currentUser = handleGetUser()
    setIsLoggedIn(!!currentUser)
    setUser(currentUser)
  }, [])
  useEffect(() => {
    if (window.location.pathname === "/shop") {
      setIsSearchVisible(true)
    } else {
      setIsSearchVisible(false)
    }
  }, [window.location.pathname])
  const openAuthModal = (mode: "login" | "signup") => {
    setAuthModal({ isOpen: true, mode })
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: "login" })
  }

  return (
    <div className="min-h-screen bg-[#f9f7f4] text-[#2c1810] font-body">
      <header className="bg-white px-4 py-4 md:px-6 border-b border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="font-luxury text-[#b8956a] text-4xl font-bold tracking-tight hover:text-[#a67c52] transition-colors duration-300 drop-shadow-sm">
                  Nuvinty
                </div>
              </Link>
            </div>

            {/* Search Bar */}
            {isSearchVisible && (
              <div className="flex-1 max-w-md relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8a7960]" />
                  <input
                    type="text"
                    placeholder="Search by brand, article..."
                    className="w-full pl-12 pr-4 py-3 bg-[#f8f8f8] rounded-full text-sm font-body placeholder-[#8a7960] focus:outline-none focus:ring-2 focus:ring-[#a67c52] focus:bg-white transition-all"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      handleSearch?.(e.target.value)
                    }}
                  />
                </div>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {isLoggedIn ? (
                <Link href="/saved">
                  <button className="flex items-center gap-2 text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body">
                    <Heart className="w-6 h-6" />
                    Save products
                  </button>{" "}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                  >
                    Sign in
                  </button>

                  <button
                    onClick={() => openAuthModal("signup")}
                    className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                  >
                    Sign up
                  </button>
                </>
              )}
              {/* More Menu */}
              {/* <div className="relative">
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className="p-2 hover:bg-[#f8f8f8] rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-[#2c1810]" />
                </button>

                {isMoreMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#e5e5e5] py-2 z-50">
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-sm text-[#2c1810] hover:bg-[#f8f8f8] transition-colors font-body"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      About
                    </Link>
                    <Link
                      href="/size-guide"
                      className="block px-4 py-2 text-sm text-[#2c1810] hover:bg-[#f8f8f8] transition-colors font-body"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      Size Guide
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-2 text-sm text-[#2c1810] hover:bg-[#f8f8f8] transition-colors font-body"
                      onClick={() => setIsMoreMenuOpen(false)}
                    >
                      Contact us
                    </Link>
                  </div>
                )}
              </div> */}
              {/* {handleGetUser() ? (
                <Link href="/bag" className="relative">
                  <Heart className="w-6 h-6 text-[red] hover:text-[#a67c52] transition-colors" />
                  <ShoppingBag className="w-6 h-6 text-[#2c1810] hover:text-[#a67c52] transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-[#a67c52] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {handleGetUser().likedProducts.length}
                  </span>
                </Link>
              ) : (
                <></>
              )} */}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Mobile Logo */}
              <Link href="/" className="flex items-center">
                <div className="font-luxury text-[#b8956a] text-2xl font-bold tracking-tight drop-shadow-sm">
                  Nuvinty
                </div>
              </Link>

              {/* Mobile Bag */}
              <Link href="/bag" className="relative p-2">
                <ShoppingBag className="w-6 h-6 text-[#2c1810]" />
                <span className="absolute top-0 right-0 bg-[#a67c52] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  0
                </span>
              </Link>
            </div>

            {/* Mobile Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8a7960]" />
              <input
                type="text"
                placeholder="Search by brand, article..."
                className="w-full pl-12 pr-4 py-3 bg-[#f8f8f8] rounded-full text-sm font-body placeholder-[#8a7960] focus:outline-none focus:ring-2 focus:ring-[#a67c52] focus:bg-white transition-all"
              />
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="mt-4 pb-4 border-t border-[#e5e5e5] pt-4">
                <div className="flex flex-col space-y-4">
                  <button className="flex items-center justify-center gap-2 text-[#2c1810] text-sm font-medium py-2 border border-[#e5e5e5] rounded-md">
                    <Heart className="w-4 h-4" />
                    Save search
                  </button>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => openAuthModal("login")}
                      className="font-body text-[#2c1810] text-sm font-medium flex-1 text-center py-2"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => openAuthModal("signup")}
                      className="font-body text-[#2c1810] text-sm font-medium flex-1 text-center py-2"
                    >
                      Sign up
                    </button>
                  </div>
                  <div className="border-t border-[#e5e5e5] pt-4 space-y-2">
                    <Link
                      href="/about"
                      className="block font-body text-[#2c1810] hover:text-[#a67c52] transition-colors font-medium py-2"
                    >
                      About
                    </Link>
                    <Link
                      href="/size-guide"
                      className="block font-body text-[#2c1810] hover:text-[#a67c52] transition-colors font-medium py-2"
                    >
                      Size Guide
                    </Link>
                    <Link
                      href="/contact"
                      className="block font-body text-[#2c1810] hover:text-[#a67c52] transition-colors font-medium py-2"
                    >
                      Contact us
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="bg-[#2c1810] text-[#f9f7f4] py-12 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-[#a67c52] mb-4 font-luxury">Nuvinty</h3>
              <p className="text-sm text-[#d4c4b0] leading-relaxed font-body">
                Discover luxury fashion from the world's most prestigious brands. Curated collections for the discerning
                fashion enthusiast.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-luxury">Shop</h4>
              <ul className="space-y-2 text-sm text-[#d4c4b0] font-body">
                <li>
                  <Link href="/women" className="hover:text-[#a67c52] transition-colors">
                    Women
                  </Link>
                </li>
                <li>
                  <Link href="/men" className="hover:text-[#a67c52] transition-colors">
                    Men
                  </Link>
                </li>
                <li>
                  <Link href="/bags" className="hover:text-[#a67c52] transition-colors">
                    Bags
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="hover:text-[#a67c52] transition-colors">
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-luxury">Company</h4>
              <ul className="space-y-2 text-sm text-[#d4c4b0] font-body">
                <li>
                  <Link href="/about" className="hover:text-[#a67c52] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#a67c52] transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-[#a67c52] transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-[#a67c52] transition-colors">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-luxury">Support</h4>
              <ul className="space-y-2 text-sm text-[#d4c4b0] font-body">
                <li>
                  <Link href="/help" className="hover:text-[#a67c52] transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-[#a67c52] transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-[#a67c52] transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="hover:text-[#a67c52] transition-colors">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}

          <div className="border-t border-[#6b5b4f] mt-8 pt-8 text-center text-sm text-[#d4c4b0] font-body">
            <p>&copy; 2024 Nuvinty. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={authModal.isOpen} onClose={closeAuthModal} mode={authModal.mode} />

      {/* Click outside to close more menu */}
      {isMoreMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />}
    </div>
  )
}
