"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { featchData, handleStoreUser } from "@/helper/general"
import { Endpoints } from "@/config"
import { toast } from "sonner"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: "login" | "signup"
}

export default function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"

      return () => {
        // Restore scroll position when modal closes
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "signup") {
      handleSignUp()
    } else {
      handleSignIn()
    }
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    const body = {
      name,
      email,
      password
    }
    try {
      const response = await featchData(Endpoints.auth.signUp, body)
      if (response.status === 201) {
        const userDetails = {
          _id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          savedSearches: response.user.savedSearches,
          likedProducts: response.user.likedProducts
        }
        handleStoreUser(userDetails)
        handleResetState()
        onClose()

      } else {
        console.log("SignUp error", response.message)
        alert(response.message)
        toast.error(response.message)
        setIsLoading(false)
      }
    } catch (error) {
      alert("SignUp error" + error)
      console.log("SignUp error", error)
      setIsLoading(false)
    }
  }
  const handleSignIn = async () => {
    setIsLoading(true)
    const body = {
      email,
      password
    }
    try {
      const response = await featchData(Endpoints.auth.signIn, body)
      if (response.status === 200) {
        const userDetails = {
          _id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          savedSearches: response.user.savedSearches,
          likedProducts: response.user.likedProducts
        }
        handleStoreUser(userDetails)
        handleResetState()
        onClose()
      } else {
        console.log("SignIn error", response.message)
        alert(response.message)
        toast.error(response.message)
        setIsLoading(false)
      }
    } catch (error) {
      alert("SignIn error" + error)
      console.log("SignIn error", error)
      setIsLoading(false)
    }
  }
  const handleResetState = () => {
    setEmail("")
    setName("")
    setPassword("")
    setIsLoading(false)
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // Handle social login
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-[#6b5b4f] hover:text-[#2c1810] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-luxury font-medium text-[#2c1810] mb-2">Welcome to Nuvinty!</h2>
          <p className="text-[#6b5b4f] font-body">
            {mode === "login" ? "Log in to continue." : "Sign up to continue."}
          </p>
        </div>


        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-[#d4c4b0] rounded-lg hover:border-[#a67c52] transition-colors font-body"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-[#2c1810] font-medium">Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin("Facebook")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border-2 border-[#d4c4b0] rounded-lg hover:border-[#a67c52] transition-colors font-body"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-[#2c1810] font-medium">Continue with Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#d4c4b0]"></div>
          <span className="text-sm text-[#6b5b4f] font-body">or</span>
          <div className="flex-1 h-px bg-[#d4c4b0]"></div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#d4c4b0] rounded-lg focus:outline-none focus:border-[#a67c52] transition-colors font-body placeholder-[#8a7960]"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#d4c4b0] rounded-lg focus:outline-none focus:border-[#a67c52] transition-colors font-body placeholder-[#8a7960]"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#d4c4b0] rounded-lg focus:outline-none focus:border-[#a67c52] transition-colors font-body placeholder-[#8a7960]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={!email || (mode === "signup" && !name) || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-luxury font-medium transition-colors ${email && !isLoading
              ? "bg-[#a67c52] text-white hover:bg-[#8a6441]"
              : "bg-[#d4c4b0] text-[#8a7960] cursor-not-allowed"
              }`}
          >
            {isLoading ? "Please wait..." : "Continue"}
          </button>
        </form>

        {/* Privacy Policy */}
        <div className="mt-6 text-center">
          <button className="text-sm text-[#6b5b4f] hover:text-[#a67c52] transition-colors font-body underline">
            Overview of our Privacy Policy
          </button>
        </div>
      </div>
    </div>
  )
}
