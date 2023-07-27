import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const getProduct = async (id: number) => {
  const product = prisma.product.findFirst({ where: { id: id } })
  return product
}

export const getProductRange = async (
  start: number = 0,
  range: number = 20,
) => {
  const products = await prisma.product.findMany({ skip: start, take: range })
  return products
}

export const addProduct = async (product: Prisma.ProductCreateInput) => {
  await prisma.product.create({ data: product })
}
