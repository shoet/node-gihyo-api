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
] as Array<Prisma.UserCreateInput>

const transactions = async () => {
  const users = DEFAULT_USERS.map((u) => prisma.user.create({ data: u }))
  return await prisma.$transaction(users)
}

const main = async () => {
  console.log('Start seeding')

  await transactions()

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
