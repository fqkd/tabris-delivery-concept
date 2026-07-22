export type ProductSection = 'own' | 'ready' | 'sale'

export type Product = {
  id: string
  name: string
  weight: string
  price: number
  oldPrice?: number
  image: string
  description: string
  ingredients: string
  shelfLife: string
  bonus: number
  sections: ProductSection[]
  ownProduction: boolean
  unavailable?: boolean
  subcategory: 'Салаты' | 'Горячее' | 'Выпечка' | 'Десерты' | 'Роллы'
}

export type DeliveryAddress = {
  city: string
  street: string
  deliveryTime: string
}

export type CartState = Record<string, number>
