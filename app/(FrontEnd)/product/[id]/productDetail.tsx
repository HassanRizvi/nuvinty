import ProductActions from "./ProductActions"
import Layout from "@/components/layout"
import { ProductInterface } from "@/types/productInterface"

interface ProductDetailProps {
  product: ProductInterface
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <Layout>
      {/* Back Button */}
      <div className="bg-[#fefdfb] py-4">
        <div className="max-w-6xl mx-auto flex justify-end">
          <ProductActions actionType="back" />
        </div>
      </div>

      {/* Product Detail */}
      <div className="bg-[#fefdfb] px-4 md:px-10 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-6">
              <ProductActions productId={product._id} images={product.images} name={product.name} />
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Brand and Name */}
              <div>
                <div className="text-sm text-[#8a7960] uppercase tracking-wide mb-2 font-luxury">
                  {product.brand}
                </div>
                <h1 className="text-3xl font-semibold text-[#2c1810] mb-4 font-luxury">
                  {product.name}
                </h1>
                <div className="text-2xl font-semibold text-[#a67c52] font-luxury">
                  {product.price ? product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "100"} {product.currency ? product.currency : ""}
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                {product.category && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Category
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.category}</p>
                  </div>
                )}

                {product.condition && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Condition
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.condition}</p>
                  </div>
                )}

                {product.material && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Material
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.material}</p>
                  </div>
                )}

                {product.color && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Color
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.color}</p>
                  </div>
                )}

                {product.location && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Location
                    </h3>
                    <p className="text-[#2c1810] font-body">{product.location}</p>
                  </div>
                )}

                {product.size && product.size.length > 0 && (
                  <div>
                    <h3 className="text-sm text-[#6b5b4f] uppercase tracking-wide mb-1 font-luxury">
                      Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.size.map((size, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#f4f0eb] text-[#2c1810] rounded-md text-sm font-body"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Verification Badge */}
              {product.type && (
                <div className="p-4 bg-[#f4f0eb] rounded-lg">
                  <div className="text-sm font-medium text-[#a67c52] font-luxury">
                    {product.type}
                  </div>
                  <div className="text-xs text-[#6b5b4f] font-body">
                    Verified authentic items
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <ProductActions productId={product._id} url={product.url} productType={product.type} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
} 