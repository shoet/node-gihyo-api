import { Request, Response, NextFunction } from 'express'

export const logRequestMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  printRequest(req)
  next()
}

const printRequest = (req: Request) => {
  console.log('===== requrest =====')
  console.log(req.headers)
  console.log(req.params)
  console.log(req.body)
}
