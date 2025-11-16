import { ProductInterface } from "@/types/productInterface"
import { Trash2, TrendingUp } from "lucide-react"

type ProductCardProps = {
  product: ProductInterface
  isDeleted?: boolean
  isBoosted?: boolean
  onDelete?: (productId: string) => void
  onBoost?: (productId: string) => void
}

export default function ProductCard({ 
  product, 
  isDeleted = false, 
  isBoosted = false, 
  onDelete, 
  onBoost 
}: ProductCardProps) {
  return (
    <div className={`border rounded p-2 text-xs relative ${isDeleted ? 'opacity-50 bg-red-50' : ''} ${isBoosted ? 'border-green-500 bg-green-50' : ''}`}>
      <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
        {product.images?.[0] && (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover" 
          />
        )}
      </div>
      <p className="font-medium truncate">{product.brand}</p>
      <p className="text-muted-foreground truncate">{product.name}</p>
      <p className="font-semibold">${product.price}</p>
      
      {(onDelete || onBoost) && (
        <div className="flex gap-1 mt-2">
          {onBoost && (
            <button
              onClick={() => onBoost(product._id)}
              className={`flex-1 py-1 px-2 rounded text-xs ${
                isBoosted 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 hover:bg-green-500 hover:text-white'
              } transition-colors`}
              title={isBoosted ? "Boosted" : "Boost"}
            >
              <TrendingUp className="w-3 h-3 mx-auto" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product._id)}
              className={`flex-1 py-1 px-2 rounded text-xs ${
                isDeleted 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 hover:bg-red-500 hover:text-white'
              } transition-colors`}
              title={isDeleted ? "Deleted" : "Delete"}
            >
              <Trash2 className="w-3 h-3 mx-auto" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

