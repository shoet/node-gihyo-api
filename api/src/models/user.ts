import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const getUser = async (options: {
  id?: number
  name?: string
  email?: string
  displayName?: string
}) => {
  const user = await prisma.user.findFirst({
    where: {
      id: options.id,
      name: options.name,
      email: options.email,
      displayName: options.displayName,
    },
  })
  return user
}

export const getUserWithoutPassword = async (options: {
  id?: number
  name?: string
  email?: string
  displayName?: string
}) => {
  const user = await getUser(options)
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export const getAllUsers = async (start?: number, range?: number) => {
  const users = await prisma.user.findMany({ skip: start, take: range })
  return users
}

export const getAllUsersWithoutPassword = async (
  start?: number,
  range?: number,
) => {
  const users = await getAllUsers(start, range)
  const withoutPassword = users.map((u) => {
    const { password, ...rest } = u
    return rest
  })
  return withoutPassword
}

export const addUser = async (user: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data: user })
}
