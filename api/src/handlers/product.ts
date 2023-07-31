/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { getProduct, getProductRange } from '../models/product'
import { ApiResponse } from '../types/api'
import { NotFound, BadRequest } from '../types/error'

export const getProductHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
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
  return { data: product, status: 200 }
}

export const getProductListHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (req.query.start && req.query.offset) {
    const start = Number(req.query.start)
    const offset = Number(req.query.offset)
    if (!isNaN(start) && !isNaN(offset)) {
      const products = await getProductRange(start, offset)
      return { data: products, status: 200 }
    }
  }
  const products = await getProductRange()
  return { data: products, status: 200 }
}
