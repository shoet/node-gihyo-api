import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_USERS = [
  {
    name: 'John',
    displayName: 'John',
    email: 'John@example.com',
    description: 'John',
    profileImageUrl: 'xxx/abc',
  },
  {
    name: 'Mika',
    displayName: 'Mika',
    email: 'Mika@example.com',
    description: 'Mika',
    profileImageUrl: 'xxx/abc',
  },
  {
    name: 'Jake',
    displayName: 'Jake',
    email: 'Jake@example.com',
    description: 'Jake',
    profileImageUrl: 'xxx/abc',
  },
] as Array<Prisma.UserCreateInput>

const DEFAULT_PRODUCTS = [
  {
    title: 'Product1',
    description: 'Product1',
    category: 'category1',
    imageUrl: 'xxx.jpeg',
    price: 2000,
    condition: 'used',
    owner: {
      connect: { id: 1 },
    } as Prisma.UserCreateNestedOneWithoutProductInput,
  },
  {
    title: 'Product2',
    description: 'Product2',
    category: 'category2',
    imageUrl: 'xxx.jpeg',
    price: 5000,
    condition: 'new',
    owner: {
      connect: { id: 3 },
    } as Prisma.UserCreateNestedOneWithoutProductInput,
  },
] as Array<Prisma.ProductCreateInput>

const usersTransaction = async () => {
  const transaction = DEFAULT_USERS.map((u) => prisma.user.create({ data: u }))
  return await prisma.$transaction(transaction)
}

const productsTransaction = async () => {
  const transaction = DEFAULT_PRODUCTS.map((p) =>
    prisma.product.create({ data: p }),
  )
  return await prisma.$transaction(transaction)
}

const main = async () => {
  console.log('Start seeding')

  await usersTransaction()
  await productsTransaction()

  console.log('Complete seeding')
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
