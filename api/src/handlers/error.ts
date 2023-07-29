import { Request, Response, NextFunction } from 'express'
import { BadRequest, Conflict, NotFound, Unauthorized } from '../types/error'
import { ApiResponse } from '../types/api'
import { verifyToken } from '../utils/http'

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export const internalErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof SyntaxError) {
    // JSON syntax invalid
    console.log('[SyntaxError]', req)
    return res.status(400).send(err.message)
  }
  if (err instanceof Conflict) {
    console.log('[Conflict]', req)
    console.log(err.message)
    return res.status(err.status).send(err.message)
  }
  if (err instanceof Unauthorized) {
    console.log('[Unauthorized]', req)
    console.log(err.message)
    return res.status(err.status).send(err.message)
  }
  if (err instanceof BadRequest) {
    console.log('[BadRequest]', req)
    return res.status(err.status).send(err.message)
  }
  if (err instanceof NotFound) {
    console.log('[NotFound]', req)
    return res.status(err.status).send(err.message)
  }
  console.log(err)
  return res.status(500).send('Internal Server Error')
}
/* eslint-enable */

/* eslint-disable @typescript-eslint/no-explicit-any */
export const tryWrapAPI = (
  handler: (
    req: Request,
    res: Response,
    next: NextFunction,
    ...rest: any[]
  ) => Promise<ApiResponse>,
  ...rest: any[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return handler(req, res, next, ...rest)
        .then(({ status, data }) => {
          return res.status(status).json(data)
        })
        .catch((err) => next(err))
    } catch (err) {
      next(err)
    }
  }
}
/* eslint-enable */

export const AuthGuard = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['token']
  if (!token) {
    throw new Unauthorized('no token provided')
  }
  const decodedPayload = verifyToken(token)
  const userId = Number(decodedPayload)
  if (isNaN(userId)) {
    throw new Unauthorized('decoded token payload is invalid')
  }
  req.userId = userId
  next()
}
