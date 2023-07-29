import { Prisma, PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

const DEFAULT_USERS = [
  {
    name: 'John',
    password: '$2b$10$CkeSJwha/4NZdda96TZ3GeqV.hvUUc20ankQdvZOT2HDtzVQYT2F', // user_1
    displayName: 'John',
    email: 'John@example.com',
    description: 'John',
    profileImageUrl: 'xxx/abc',
  },
  {
    name: 'Mika',
    password: '$2b$10$KF6USj/38nrmdvuSyidb1ewBpQFFVitlg1561Z0xDz2XvPH10GZA', // user_2
    displayName: 'Mika',
    email: 'Mika@example.com',
    description: 'Mika',
    profileImageUrl: 'xxx/abc',
  },
  {
    name: 'Jake',
    password: '$2b$10$uT3NRpFNYeK3L9jw81MpveF4gG/U6yyOJlbVGBLioadWljeaU3R0', // user_3
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
  },
  {
    title: 'Product2',
    description: 'Product2',
    category: 'category2',
    imageUrl: 'xxx.jpeg',
    price: 5000,
    condition: 'new',
  },
] as Array<Prisma.ProductCreateInput>

const usersTransaction = async () => {
  const transaction = DEFAULT_USERS.map((u) => prisma.user.create({ data: u }))
  return await prisma.$transaction(transaction)
}

const productsTransaction = async (users: User[]) => {
  const transaction = DEFAULT_PRODUCTS.map((p, idx) => {
    p.owner = { connect: { id: users[idx].id } }
    return prisma.product.create({ data: p as Prisma.ProductCreateInput })
  })
  return await prisma.$transaction(transaction)
}

const main = async () => {
  console.log('Start seeding')

  const users = await usersTransaction()
  console.log(JSON.stringify(users))
  const products = await productsTransaction(users)
  console.log(JSON.stringify(products))

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
