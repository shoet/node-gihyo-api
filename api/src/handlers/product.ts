import { Request } from 'express'
import { getProduct, getProductRange } from '../models/product'
import { NotFound, BadRequest } from '../types/error'

export const getProductHandler = async (req: Request) => {
  if (!req.params.id) {
    throw new BadRequest('"id" is not found in params', req)
  }
  const productId = Number(req.params.id)
  if (isNaN(productId)) {
    throw new NotFound('product is not found')
  }
  const product = await getProduct(productId)
  if (product === null) {
    throw new NotFound('product is not found')
  }
  return product
}

export const getProductListHandler = async (req: Request) => {
  if (req.query.start && req.query.offset) {
    const start = Number(req.query.start)
    const offset = Number(req.query.offset)
    if (!isNaN(start) && !isNaN(offset)) {
      const products = await getProductRange(start, offset)
      return products
    }
  }
  const products = await getProductRange()
  return products
}
