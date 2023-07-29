import { NextFunction, Request, Response } from 'express'
import { getUser, getAllUsers } from '../models/user'
import { BadRequest, NotFound } from '../types/error'

export const getUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id) {
    throw new BadRequest('"id" is not found in params', req)
  }
  const userId = Number(req.params.id)
  if (isNaN(userId)) {
    throw new NotFound('user is not found')
  }
  const user = await getUser({ id: userId })
  if (user === null) {
    throw new NotFound('user is not found')
  }
  return user
}

export const getAllUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
  offsetRange: number = 5,
) => {
  if (req.query.offset) {
    const start = Number(req.query.offset)
    if (isNaN(start)) throw new BadRequest('offset is not number', req)

    const range = offsetRange
    const users = await getAllUsers(start, range)
    return users
  }
  const users = await getAllUsers()
  return users
}
