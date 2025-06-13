import { PackagePlus, Edit } from 'lucide-react'
import type { Product } from '@/hooks/useProducts'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => void
  product?: Product
  title: string
  description: string
}

export const ProductForm = ({
  isOpen,
  onClose,
  onSubmit,
  product,
  title,
  description
}: ProductFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-green-800">
        <DialogHeader>
          <DialogTitle className="text-green-800 flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              {product ? (
                <Edit className="h-5 w-5 text-green-800" />
              ) : (
                <PackagePlus className="h-5 w-5 text-green-800" />
              )}
            </div>
            {title}
          </DialogTitle>
          <DialogDescription className="text-green-800">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-green-800 font-medium">
                Nombre
              </Label>
              <Input 
                id="name" 
                name="name"
                defaultValue={product?.name}
                required
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right text-green-800 font-medium">
                Categoría
              </Label>
              <Select name="category" defaultValue={product?.category} required>
                <SelectTrigger className="col-span-3 border-green-200 focus:border-green-500 rounded-lg">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-green-200">
                  <SelectItem value="sativa">🌱 Sativa</SelectItem>
                  <SelectItem value="indica">🍃 Indica</SelectItem>
                  <SelectItem value="hibrida">🌿 Híbrida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thc" className="text-right text-green-800 font-medium">
                THC %
              </Label>
              <Input 
                id="thc" 
                name="thc"
                type="number"
                defaultValue={product?.thc}
                required
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="CBD" className="text-right text-green-800 font-medium">
                CBD %
              </Label>
              <Input 
                id="CBD" 
                name="CBD"
                type="number"
                defaultValue={product?.CBD}
                required
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right text-green-800 font-medium">
                Precio €
              </Label>
              <Input 
                id="price" 
                name="price"
                type="number" 
                step="0.01"
                defaultValue={product?.price}
                required
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right text-green-800 font-medium">
                Stock
              </Label>
              <Input 
                id="stock" 
                name="stock"
                type="number"
                defaultValue={product?.stock}
                required
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-green-800 font-medium">
                Descripción
              </Label>
              <Textarea 
                id="description" 
                name="description"
                defaultValue={product?.description}
                required
                className="col-span-3 border-green-200 focus:border-green-500 rounded-lg" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right text-green-800 font-medium">
                Imagen
              </Label>
              <div className="col-span-3">
                <Input 
                  id="image" 
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Actualizar el FormData con el nuevo archivo
                      const formData = new FormData(e.target.form!)
                      formData.set('image', file)
                    }
                  }}
                  className="border-green-200 focus:border-green-500 rounded-lg" 
                />
                <p className="text-sm text-green-800 mt-1">
                  Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              type="button"
              variant="outline" 
              onClick={onClose} 
              className="border-green-200 hover:text-green-800 text-green-800 hover:bg-green-50 rounded-lg"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg"
            >
              {product ? 'Guardar Cambios' : 'Agregar Producto'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 