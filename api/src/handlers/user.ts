import { Request } from 'express'
import { getUser, getAllUsers } from '../models/user'
import { ApiError, BadRequest } from '../types/error'

export const getUserHandler = async (req: Request) => {
  if (!req.params.id) {
    throw new BadRequest('"id" is not found in params', req)
  }
  const userId = Number(req.params.id)
  if (isNaN(userId)) {
    throw new ApiError('user is not found', 400)
  }
  const user = await getUser(userId)
  if (user === null) {
    throw new ApiError('user is not found', 400)
  }
  return user
}

export const getAllUserHandler = async (
  req: Request,
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