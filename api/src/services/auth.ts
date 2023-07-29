import { Prisma, User } from '@prisma/client'
import { addUser, getUser } from '../models/user'
import { Conflict, Unauthorized } from '../types/error'
import { hashPass, compare } from '../lib/bcrypt'

export type AuthedUser = Omit<User, 'password'>

export const authLogin = async (
  email: string,
  password: string,
): Promise<AuthedUser> => {
  const user = await getUser({ email: email })
  if (!user) {
    throw new Unauthorized('User not found')
  }
  if (!compare(password, user.password)) {
    throw new Unauthorized('Incorrect password')
  }
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export type AuthSignUpProps = Prisma.UserCreateInput
export const authSignUp = async (
  params: AuthSignUpProps,
): Promise<AuthedUser> => {
  const aleadyUser = await getUser({ email: params.email })
  if (aleadyUser) {
    throw new Conflict('User already exists')
  }
  // TODO: Validate inputs
  const hashedPassword = await hashPass(params.password)
  const newUser: Prisma.UserCreateInput = {
    ...params,
    password: hashedPassword,
  }
  const { password, ...userWithoutPassword } = await addUser(newUser)
  return userWithoutPassword
}
