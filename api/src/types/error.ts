import { Request } from 'express'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export class BadRequest extends Error {
  status: number
  req: Request
  message: string

  constructor(message: string, req: Request) {
    super('BadRequest')
    this.status = 400
    this.req = req
    this.message = message
  }
}

export class NotFound extends Error {
  status: number
  message: string

  constructor(message: string) {
    super('NotFound')
    this.status = 404
    this.message = message
  }
}
