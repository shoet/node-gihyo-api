import { NextFunction, Request, Response } from 'express'
import { BadRequest } from '../types/error'
import { authLogin, authSignUp, AuthSignUpProps } from '../services/auth'
import { setCookieToken } from '../utils/http'

export const signUpHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body
  if (!body.email || !body.password) throw new BadRequest('Invalid params', req)

  // TODO: body length default max 100kb
  // TODO: validation inputs

  const props: AuthSignUpProps = {
    email: body.email,
    password: body.password,
    name: body.name,
    description: body.description,
    displayName: body.displayName,
    profileImageUrl: body.profileImageUrl,
  }
  const user = await authSignUp(props)
  console.log(`SignUp user ${user.id}`)
  setCookieToken(res, user)
  return user
}

export const signInHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body
  if (!body.email || !body.password) throw new BadRequest('Invalid params', req)
  const user = await authLogin(body.email, body.password)
  setCookieToken(res, user)
  return user
}
