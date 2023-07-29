import { Response } from 'express'
import { AuthedUser } from '../services/auth'
import * as jwt from 'jsonwebtoken'
import { Unauthorized } from '../types/error'

export function generateToken(user: AuthedUser): string {
  if (!process.env.JWT_SECRET_KEY)
    throw new Error('configure environment JWT_SECRET_KEY')
  const token = jwt.sign(`${user.id}`, process.env.JWT_SECRET_KEY)
  return token
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error('configure environment JWT_SECRET_KEY')
  }
  try {
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY)
    return decodedPayload
  } catch (err) {
    throw new Unauthorized('token is invalid')
  }
}

export function setCookieToken(
  res: Response,
  user: AuthedUser,
  tokenKey: string = 'auth_token',
) {
  const token = generateToken(user)
  res.cookie(tokenKey, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // TODO
    maxAge: 1000 * 60 * 60 * 24 * 14, // 2 week
  })
}
