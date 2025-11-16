import FiltersData from "@/categories.json"

type ProductFiltersProps = {
  category: string
  brand: string
  condition: string
  size: string
  gender: string
  price: string
  onCategoryChange: (value: string) => void
  onBrandChange: (value: string) => void
  onConditionChange: (value: string) => void
  onSizeChange: (value: string) => void
  onGenderChange: (value: string) => void
  onPriceChange: (value: string) => void
  onClearAll: () => void
}

export default function ProductFilters({
  category,
  brand,
  condition,
  size,
  gender,
  price,
  onCategoryChange,
  onBrandChange,
  onConditionChange,
  onSizeChange,
  onGenderChange,
  onPriceChange,
  onClearAll,
}: ProductFiltersProps) {
  const selectedCategory = FiltersData.find((cat) => cat.category === category)

  return (
    <div className="flex flex-wrap gap-4">
      {/* Category */}
      <div className="flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] md:flex-1 md:min-w-[10rem]">
        <select
          className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body"
          onChange={(e) => onCategoryChange(e.target.value)}
          value={category}
        >
          <option value="">All Categories</option>
          {FiltersData.map((cat: any) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] md:flex-1 md:min-w-[10rem]">
        <select
          className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body"
          onChange={(e) => onBrandChange(e.target.value)}
          value={brand}
        >
          <option value="">All Brands</option>
          {category
            ? selectedCategory?.brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))
            : FiltersData.flatMap((cat) => cat.brands).map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
        </select>
      </div>

      {/* Condition */}
      <div className="flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] md:flex-1 md:min-w-[10rem]">
        <select
          className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body"
          onChange={(e) => onConditionChange(e.target.value)}
          value={condition}
        >
          <option value="">Any Condition</option>
          <option value="New without tags">New without tag</option>
          <option value="New without box">New without box</option>
          <option value="New other">New other</option>
          <option value="Open box">Open box</option>
          <option value="New - Open box">New - Open box</option>
        </select>
      </div>

      {/* Size (conditional) */}
      {selectedCategory?.haveSize && (
        <div className="flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] md:flex-1 md:min-w-[10rem]">
          <select
            className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body"
            onChange={(e) => onSizeChange(e.target.value)}
            value={size}
          >
            <option value="">Any Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
            <option value="XXXL">XXXL</option>
          </select>
        </div>
      )}

      {/* Gender (conditional) */}
      {selectedCategory?.haveGender && (
        <div className="flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] md:flex-1 md:min-w-[10rem]">
          <select
            className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body"
            onChange={(e) => onGenderChange(e.target.value)}
            value={gender}
          >
            <option value="">Any Gender</option>
            <option value="Mens">Male</option>
            <option value="Womens">Female</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] md:flex-1 md:min-w-[10rem]">
        <select
          className="w-full px-4 py-2 border border-[#d4c4b0] rounded-md bg-[#fefdfb] text-[#2c1810] text-sm focus:outline-none focus:border-[#a67c52] font-body"
          onChange={(e) => onPriceChange(e.target.value)}
          value={price}
        >
          <option value="">Any Price</option>
          <option value="0-200">Under $200</option>
          <option value="200-400">$200 - $400</option>
          <option value="400-600">$400 - $600</option>
          <option value="600+">$600+</option>
        </select>
      </div>

      {/* Clear All */}
      <div className="flex items-center gap-3 w-full sm:w-[calc(50%-0.5rem)] md:flex-1 md:min-w-[10rem]">
        <button
          onClick={onClearAll}
          className="w-full py-2 bg-[#fefdfb] text-[#a67c52] text-sm font-body"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

