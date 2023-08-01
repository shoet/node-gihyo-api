import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const getProduct = async (id: number) => {
  const product = prisma.product.findFirst({
    where: { id: id },
    include: { owner: { select: { id: true } } },
  })
  return product
}

export const getProductRange = async (
  start: number = 0,
  range: number = 20,
) => {
  const products = await prisma.product.findMany({
    skip: start,
    take: range,
    include: { owner: { select: { id: true } } },
  })
  return products
}

export const addProduct = async (product: Prisma.ProductCreateInput) => {
  const newProduct = await prisma.product.create({ data: product })
  return newProduct
}

export const deleteProduct = async (productId: number) => {
  const deletedItem = await prisma.product.delete({ where: { id: productId } })
  return deletedItem
}
