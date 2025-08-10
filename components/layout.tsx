"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Search, ShoppingBag, Menu, X, MoreHorizontal, Heart } from "lucide-react"
import Link from "next/link"
import AuthModal from "./auth-modal"
import { deleteCookie, GetData, handleGetUser } from "@/helper/general"
import { Endpoints } from "@/config"
import { usePathname, useRouter } from "next/navigation"
import "./layoutStyle.css"

interface LayoutProps {
  children: React.ReactNode
  handleSearch?: (search: string) => void
  searchQuery?: string
}

export default function Layout({ children, handleSearch, searchQuery }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false)
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "signup" | "query" }>({
    isOpen: false,
    mode: "login",
  })
  const [productSearch, setProductSearch] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [Role, setRole] = useState<any>(null)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  useEffect(() => {
    const currentUser = handleGetUser()
    setIsLoggedIn(!!currentUser)
    setUser(currentUser)
  }, [])
  useEffect(() => {
    getUserRole()
  }, [user])
  useEffect(() => {
    setProductSearch(searchQuery || "")
  }, [searchQuery])
  const getUserRole = async () => {
    const currentUser = handleGetUser()
    const response = await GetData(Endpoints.user.getUser(currentUser._id))
    if (response.status === 200) {
      setRole(response.data.role)
    }
  }
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    setIsSearchVisible(pathname === "/shop");
  }, [pathname]);
  const openAuthModal = (mode: "login" | "signup" | "query") => {
    setAuthModal({ isOpen: true, mode })
  }

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, mode: "login" })
    window.location.reload()
  }
  const signOut = () => {
    deleteCookie("user")
    window.location.reload()
  }
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounced navigation effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (debouncedSearch && pathname !== "/shop") {
        router.push(`/shop?q=${debouncedSearch}`)
      }
    }, 500) // 500ms delay

    return () => clearTimeout(timeoutId)
  }, [debouncedSearch, pathname, router])

  const handingNavigateToSearch = (value: string) => {
    setDebouncedSearch(value)
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
            {/* {isSearchVisible && ( */}
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
                      // If not on /shop page, navigate to /shop
                      if (pathname !== "/shop") {
                        handingNavigateToSearch(e.target.value)
                        // router.push(`/shop?q=${e.target.value}`)
                      }else{
                        handleSearch?.(e.target.value)
                      }
                    }}
                  />
                </div>
              </div>
            {/* )} */}

            {/* Right Side Actions */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {isLoggedIn ? (
                <>
                  <Link href="/saved">
                    <button className="flex items-center gap-2 text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body">
                      <Heart className="w-6 h-6" />
                      Save products
                    </button>{" "}
                  </Link>
                  {Role === "admin" && (
                    <button
                      onClick={() => openAuthModal("query")}
                      className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                    >
                      Add Query
                    </button>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                  >
                    Sign out
                  </button>
                </>
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
                  {/* <Link href="/contact">
                  <button
                    // onClick={() => openAuthModal("signup")}
                    className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                  >
                    Contact Us
                  </button>
                  </Link> */}
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden  top-0 bg-white z-50 w-full">
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
              {isLoggedIn ? (
                <>
                  <div></div>
                </>
              ) : (
                <></>
              )}
            </div>

            {/* Mobile Search */}
            {isSearchVisible && (
              <div className="mt-4 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#8a7960]" />
                <input
                  type="text"
                  placeholder="Search by brand, article..."
                  className="w-full pl-12 pr-4 py-3 bg-[#f8f8f8] rounded-full text-sm font-body placeholder-[#8a7960] focus:outline-none focus:ring-2 focus:ring-[#a67c52] focus:bg-white transition-all"
                  value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      // If not on /shop page, navigate to /shop
                      if (pathname !== "/shop") {
                        handingNavigateToSearch(e.target.value)
                        // router.push(`/shop?q=${e.target.value}`)
                      }else{
                        handleSearch?.(e.target.value)
                      }
                    }}
                />
              </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="mt-4 pb-4 border-t border-[#e5e5e5] pt-4">
                <div className="flex flex-col space-y-4">
                  {/* {isLoggedIn && ( */}
                    <button 
                      onClick={() => {
                        if (isLoggedIn) {
                          router.push("/saved")
                        } else {
                          openAuthModal("login")
                        }
                      }}
                    className="flex items-center justify-center gap-2 text-[#2c1810] text-sm font-medium py-2 border border-[#e5e5e5] rounded-md">
                      <Heart className="w-4 h-4" />
                      My Account
                    </button>
                  {/* )} */}
                  {/* {!isLoggedIn && (
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
                  )} */}
                  {isLoggedIn ? (
                    <>
                      <div className="flex flex-col items-left gap-2">
                        {Role === "admin" && (
                          <button
                            onClick={() => openAuthModal("query")}
                            className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                          >
                            Add Query
                          </button>
                        )}
                        <button
                          onClick={() => signOut()}
                          className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
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
                  {/* <Link href="/about" className="text-center">
                    <button
                      // onClick={() => openAuthModal("signup")}
                      className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                    >
                      About
                    </button>
                  </Link> */}
                  {/* {
                    isLoggedIn && (
                      <button
                          onClick={() => signOut()}
                          className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                        >
                          Sign out
                        </button>
                    )
                  } */}
                  <div className="flex flex-col items-left gap-2">
                        <button
                          onClick={() => router.push("/shop")}
                          className="text-[#2c1810] text-sm font-medium hover:text-[#a67c52] transition-colors font-body"
                        >
                          Shop
                        </button>
                      </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main>{children}</main>
      <footer>
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        Nuvinty
                    </div>
                    <p className="footer-tagline">
                        Discover conscious luxury fashion from the world's most prestigious brands. Where sustainability
                        meets style.
                    </p>
                    <div className="social-links">
                        <a aria-label="Instagram" href="https://instagram.com/nuvinty" target="_blank">
                            <span>
                                IG
                            </span>
                        </a>
                        <a aria-label="Facebook" href="https://facebook.com/nuvinty" target="_blank">
                            <span>
                                FB
                            </span>
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>
                        Company
                    </h3>
                    <ul>
                        <li>
                            <a href="/about">
                                Who Are We?
                            </a>
                        </li>
                        <li>
                            <a href="/contact">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>
                        Support
                    </h3>
                    <ul>
                        <li>
                            <a href="/size-guide">
                                Size Guide
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>
                        Legal
                    </h3>
                    <ul>
                        <li>
                            <a href="/terms">
                                Terms &amp; Conditions
                            </a>
                        </li>
                        <li>
                            <a href="/privacy">
                                Privacy Policy
                            </a>
                        </li>
                        <li>
                            <a href="/affiliate-disclosure">
                                Affiliate Disclosure
                            </a>
                        </li>
                        <li>
                            <a href="/cookies">
                                Cookie Policy
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>
                    © 2025 Nuvinty. All rights reserved.
                </p>
                <p>
                    Conscious luxury fashion for the modern world.
                </p>
            </div>
        </div>
    </footer>

      {/* <footer className="bg-[#2c1810] text-[#f9f7f4] py-12 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-[#6b5b4f] mt-8 pt-8 text-center text-sm text-[#d4c4b0] font-body">
            <p>&copy; 2024 Nuvinty. All rights reserved.</p>
          </div>
        </div>
      </footer> */}

      {/* Auth Modal */}
      <AuthModal isOpen={authModal.isOpen} onClose={closeAuthModal} mode={authModal.mode} />

      {/* Click outside to close more menu */}
      {isMoreMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMoreMenuOpen(false)} />}
    </div>
  )
}
