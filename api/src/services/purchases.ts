import { deleteProduct } from '../models/product'

export const productPurchase = (productId: number) => {
  const purchaseItem = deleteProduct(productId)
  return purchaseItem
}
