import { Users, Award, Globe, Heart } from "lucide-react"
import Layout from "@/components/layout"

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-10 bg-gradient-to-br from-[#f9f7f4] to-[#fefdfb]">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2c1810] mb-6">
            About <span className="text-[#a67c52]">Nuvinty</span>
          </h1>
          <p className="text-xl text-[#6b5b4f] leading-relaxed">
            We're passionate about making luxury fashion accessible to everyone. Our mission is to connect fashion
            enthusiasts with authentic, high-quality pieces from the world's most prestigious brands.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 md:px-10 bg-[#fefdfb]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2c1810] mb-6">Our Story</h2>
              <div className="space-y-4 text-[#6b5b4f] leading-relaxed">
                <p>
                  Founded in 2020, Nuvinty began as a vision to democratize luxury fashion. We recognized that authentic
                  luxury pieces were often difficult to find, verify, and purchase with confidence.
                </p>
                <p>
                  Our founders, passionate fashion enthusiasts themselves, set out to create a platform that would
                  bridge the gap between luxury fashion houses and discerning customers worldwide.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 customers globally, offering carefully curated collections
                  from more than 200 luxury brands.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#a67c52] to-[#8a6441] rounded-2xl p-8 text-white">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">50K+</div>
                  <div className="text-sm opacity-90">Happy Customers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">200+</div>
                  <div className="text-sm opacity-90">Luxury Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">17K+</div>
                  <div className="text-sm opacity-90">Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">4.9★</div>
                  <div className="text-sm opacity-90">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 md:px-10 bg-[#f9f7f4]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1810] mb-4">Our Values</h2>
            <p className="text-lg text-[#6b5b4f] max-w-2xl mx-auto">
              These core principles guide everything we do at Nuvinty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-4">Authenticity</h3>
              <p className="text-[#6b5b4f] text-sm leading-relaxed">
                Every item is rigorously authenticated by our team of experts to ensure you receive only genuine luxury
                pieces.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-4">Community</h3>
              <p className="text-[#6b5b4f] text-sm leading-relaxed">
                We believe in building a community of fashion enthusiasts who share a passion for quality, style, and
                authenticity.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-4">Sustainability</h3>
              <p className="text-[#6b5b4f] text-sm leading-relaxed">
                By promoting pre-owned luxury fashion, we contribute to a more sustainable and circular fashion economy.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-[#d4c4b0]">
              <div className="w-16 h-16 bg-[#a67c52] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-4">Excellence</h3>
              <p className="text-[#6b5b4f] text-sm leading-relaxed">
                We strive for excellence in every aspect of our service, from curation to customer support and delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 md:px-10 bg-[#fefdfb]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c1810] mb-4">Meet Our Team</h2>
            <p className="text-lg text-[#6b5b4f]">The passionate individuals behind Nuvinty's success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#a67c52] to-[#8a6441] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                SJ
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-2">Sarah Johnson</h3>
              <p className="text-[#a67c52] font-medium mb-3">Founder & CEO</p>
              <p className="text-[#6b5b4f] text-sm leading-relaxed">
                Former fashion buyer with 15 years of experience in luxury retail. Sarah's vision drives Nuvinty's
                commitment to authenticity and quality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#a67c52] to-[#8a6441] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                MC
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-2">Michael Chen</h3>
              <p className="text-[#a67c52] font-medium mb-3">Head of Authentication</p>
              <p className="text-[#6b5b4f] text-sm leading-relaxed">
                Expert authenticator with a keen eye for detail. Michael ensures every piece meets our rigorous
                authenticity standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#a67c52] to-[#8a6441] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                ER
              </div>
              <h3 className="text-xl font-semibold text-[#2c1810] mb-2">Emma Rodriguez</h3>
              <p className="text-[#a67c52] font-medium mb-3">Customer Experience Director</p>
              <p className="text-[#6b5b4f] text-sm leading-relaxed">
                Dedicated to creating exceptional customer experiences. Emma leads our customer service team with
                passion and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-10 bg-[#2c1810] text-[#fefdfb]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-[#d4c4b0] leading-relaxed mb-8">
            To make luxury fashion accessible, authentic, and sustainable for fashion enthusiasts worldwide. We believe
            everyone deserves to express their unique style through exceptional pieces that tell a story.
          </p>
          <div className="bg-[#a67c52] text-[#fefdfb] px-8 py-4 rounded-lg inline-block">
            <p className="font-semibold">Join us in redefining luxury fashion</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
