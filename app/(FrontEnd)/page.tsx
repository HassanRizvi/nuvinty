import Link from "next/link"
import { ArrowRight, Star, Shield, Truck, RefreshCw } from "lucide-react"
import Layout from "@/components/layout"
import Head from "next/head"
import FiltersData from "@/categories.json"

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#fefdfb] to-[#f9f7f4] py-24 px-4 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-luxury font-medium text-[#2c1810] leading-[0.9] mb-8 tracking-tight">
                Curated
                <span className="block text-[#a67c52] italic">Luxury</span>
                <span className="block">Fashion</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  prefetch={true}
                  href="/shop"
                  className="bg-[#2c1810] text-[#fefdfb] px-8 py-4 font-luxury font-medium hover:bg-[#1a0f08] transition-colors inline-flex items-center justify-center gap-2 tracking-wide"
                >
                  Explore Collection
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="border border-[#a67c52] text-[#a67c52] px-8 py-4 font-luxury font-medium hover:bg-[#a67c52] hover:text-[#fefdfb] transition-colors inline-flex items-center justify-center tracking-wide"
                >
                  Our Story
                </Link>
              </div>
              <p className="text-lg text-[#6b5b4f] mb-10 leading-relaxed font-light max-w-md">
                Discover exceptional pieces from the world's most prestigious fashion houses. Where exclusivity meets
                conscious fashion.
              </p>
            </div>

            <div className="relative">
              <div className="bg-[#f4f0eb] p-12 text-center">
                <div className="text-6xl font-luxury font-light text-[#a67c52] mb-4">17,302</div>
                <div className="text-xl font-luxury text-[#2c1810] mb-2">Curated Pieces</div>
                <div className="text-sm text-[#6b5b4f] font-light">From prestigious fashion houses</div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#2c1810] text-[#fefdfb] p-6 text-center">
                <div className="text-2xl font-luxury font-medium">4.9★</div>
                <div className="text-xs font-light tracking-wide">Excellence Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-10 bg-[#fefdfb]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1810] mb-4">Why Choose Nuvinty?</h2>
            <p className="text-lg text-[#6b5b4f] max-w-2xl mx-auto">
              We're committed to providing an exceptional luxury shopping experience with unmatched quality and service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-2">Premium Quality</h3>
              <p className="text-[#6b5b4f] text-sm">
                Every item is carefully authenticated and inspected to ensure the highest quality standards.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-2">Authenticity Guaranteed</h3>
              <p className="text-[#6b5b4f] text-sm">
                All luxury items come with certificates of authenticity from verified sellers worldwide.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-2">Fast Shipping</h3>
              <p className="text-[#6b5b4f] text-sm">
                Express delivery options available with secure packaging for your luxury purchases.
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-2">Easy Returns</h3>
              <p className="text-[#6b5b4f] text-sm">
                30-day return policy with free return shipping on all luxury fashion items.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-16 px-4 md:px-10 bg-[#f9f7f4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1810] mb-4">Featured Luxury Brands</h2>
            <p className="text-lg text-[#6b5b4f]">Shop from the world's most prestigious fashion houses</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {/* {FiltersData.brands.map(
              (brand) => (
                <div
                  key={brand}
                  className="bg-white rounded-lg p-6 text-center shadow-sm border border-[#d4c4b0] hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-semibold text-[#a67c52]">{brand}</div>
                </div>
              ),
            )} */}
            {
              FiltersData.flatMap((cat) => cat.brands)
                .sort(() => Math.random() - 0.5) // Shuffle array randomly
                .slice(0, 8) // Take first 8 items
                .map((brand) => (
                  <Link
                    key={brand}
                    href={`/shop?brand=${encodeURIComponent(brand)}`}
                    className="bg-white rounded-lg p-6 text-center shadow-sm border border-[#d4c4b0] hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="text-sm font-semibold text-[#a67c52]">{brand}</div>
                  </Link>
                ))
            }
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-10 bg-[#2c1810] text-[#fefdfb]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Elevate Your Style?</h2>
          <p className="text-lg text-[#d4c4b0] mb-8 leading-relaxed">
            Join thousands of fashion enthusiasts who trust Nuvinty for their luxury fashion needs. Start your journey
            to exceptional style today.
          </p>
          <Link
            href="/shop"
            className="bg-[#a67c52] text-[#fefdfb] px-10 py-4 rounded-lg font-semibold hover:bg-[#8a6441] transition-colors inline-flex items-center gap-2 text-lg"
          >
            Start Shopping
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
