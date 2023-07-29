import { Response } from 'express'
import { AuthedUser } from '../services/auth'

export function generateToken(user: AuthedUser): string {
  // TODO: implement
  return 'dummy_token'
}

export function setCookieToken(res: Response, user: AuthedUser) {
  const token = generateToken(user)
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // TODO
    maxAge: 1000 * 60 * 60 * 24 * 14, // 2 week
  })
}
