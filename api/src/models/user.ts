import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const getUser = async (options: {
  id?: number
  name?: string
  email?: string
  displayName?: string
}) => {
  const user = prisma.user.findFirst({
    where: {
      id: options.id,
      name: options.name,
      email: options.email,
      displayName: options.displayName,
    },
  })
  return user
}

export const getAllUsers = async (start?: number, range?: number) => {
  const users = await prisma.user.findMany({ skip: start, take: range })
  return users
}

export const addUser = async (user: Prisma.UserCreateInput) => {
  await prisma.user.create({ data: user })
}
