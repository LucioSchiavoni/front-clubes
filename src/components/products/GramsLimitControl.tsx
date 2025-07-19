import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface GramsLimitControlProps {
  minGrams: number
  maxGrams: number
  stock: number
  quantity: number
  setQuantity: (q: number) => void
}

export function GramsLimitControl({ minGrams, maxGrams, stock, quantity, setQuantity }: GramsLimitControlProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const isBelowMin = minGrams > 0 && quantity < minGrams
  const isAboveMax = maxGrams > 0 && quantity > maxGrams
  const isOutOfStock = stock === 0
  const isInvalid = isBelowMin || isAboveMax || isOutOfStock

  const handleQuantityChange = (value: number) => {
    let newValue = value
    if (minGrams > 0 && newValue < minGrams) newValue = minGrams
    if (maxGrams > 0 && newValue > maxGrams) newValue = maxGrams
    if (newValue > stock) newValue = stock
    setQuantity(newValue)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    let numValue = Number.parseInt(value)
    if (isNaN(numValue)) return
    if (minGrams > 0 && numValue < minGrams) numValue = minGrams
    if (maxGrams > 0 && numValue > maxGrams) numValue = maxGrams
    if (numValue > stock) numValue = stock
    setQuantity(numValue)
  }

  return (
    <div>
      {(minGrams > 0 || maxGrams > 0) && (
        <div className="flex justify-center gap-2 mb-1">
          {minGrams > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/40">
              Mínimo: {minGrams}g
            </span>
          )}
          {maxGrams > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/40">
              Máximo: {maxGrams}g
            </span>
          )}
        </div>
      )}
      <div className="grid grid-cols-4 text-xl sm:grid-cols-2 gap-1 mb-2">
        {[5, 10, 20, 40].map((value) => (
          <Button
            key={value}
            variant="ghost"
            size="sm"
            className="h-6 px-1 text-xs text-white/80 hover:bg-white/10 border-0"
            onClick={() => handleQuantityChange(value)}
            disabled={value > stock || (maxGrams > 0 && value > maxGrams)}
          >
            +{value}g
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-center space-x-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/80 hover:bg-white/10 border border-gray-600/30 rounded"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= (minGrams > 0 ? minGrams : 1)}
        >
          -
        </Button>
        {isEditing ? (
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={() => { setIsEditing(false); setInputValue(""); }}
            className="h-6 w-12 text-center text-xs bg-black/30 border border-gray-600/30 text-white/90 focus-visible:ring-1 focus-visible:ring-emerald-500"
            min={minGrams > 0 ? minGrams : 1}
            max={maxGrams > 0 ? Math.min(maxGrams, stock) : stock}
            autoFocus
          />
        ) : (
          <span
            className="text-white/90 font-bold min-w-[1.5rem] text-center text-sm cursor-pointer hover:text-emerald-400 transition-colors px-1 py-0.5 border border-gray-600/30 rounded bg-black/20"
            onClick={() => { setIsEditing(true); setInputValue(quantity.toString()); }}
          >
            {quantity}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/80 hover:bg-white/10 border border-gray-600/30 rounded"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= (maxGrams > 0 ? Math.min(maxGrams, stock) : stock)}
        >
          +
        </Button>
      </div>
      {(isBelowMin || isAboveMax) && (
        <div className="text-red-400 text-xs text-center mb-2">
          {isBelowMin && `El mínimo permitido es ${minGrams}g`}
          {isAboveMax && `El máximo permitido es ${maxGrams}g`}
        </div>
      )}
    </div>
  )
} 