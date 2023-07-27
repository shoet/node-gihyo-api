import { Request, Response, NextFunction } from 'express'
import { ApiError, BadRequest, NotFound } from '../types/error'

/* eslint-disable @typescript-eslint/no-unused-vars */
export const notfoundErrorMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log('Not Found')
  console.log(req.headers)
  console.log(req.path)
  return res.status(404).send('Not Found')
}
/* eslint-enable */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
export const internalErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof SyntaxError) {
    // JSON syntax invalid
    return res.status(400).send(err.message)
  }
  if (err instanceof ApiError) {
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
  handler: (req: Request, ...rest: any[]) => Promise<any>,
  ...rest: any[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      handler(req, ...rest)
        .then((data: any) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(data)
          }
          res.status(200).json(data)
        })
        .catch((err) => next(err))
    } catch (err) {
      next(err)
    }
  }
}
/* eslint-enable */
