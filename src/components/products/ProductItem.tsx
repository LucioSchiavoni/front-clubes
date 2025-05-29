import { PackagePlus } from 'lucide-react'
import type { Product } from '@/hooks/useProducts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProductItemProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

const ProductItem = ({ product, isOpen, onClose }: ProductItemProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-2xl border-green-200">
        <DialogHeader>
          <DialogTitle className="text-green-800 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <PackagePlus className="h-5 w-5 text-green-600" />
            </div>
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-green-600">
            Detalles del producto
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="relative aspect-square w-full max-h-[400px] rounded-xl overflow-hidden">
            {product.image ? (
              <img 
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-green-100 flex items-center justify-center">
                <PackagePlus className="h-16 w-16 text-green-600" />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Categoría:</span>
                <span className="font-medium text-green-800">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">THC:</span>
                <span className="font-medium text-green-800">{product.thc}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">CBD:</span>
                <span className="font-medium text-green-800">{product.CBD}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Precio:</span>
                <span className="font-medium text-green-800">€{product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Stock:</span>
                <span className="font-medium text-green-800">{product.stock}g</span>
              </div>
              {product.club && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Club:</span>
                  <span className="font-medium text-green-800">{product.club.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <span className="text-green-600 block">Descripción:</span>
            <p className="text-green-800">{product.description}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductItem