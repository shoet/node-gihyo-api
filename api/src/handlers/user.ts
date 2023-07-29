/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { getUserWithoutPassword } from '../models/user'
import { ApiResponse } from '../types/api'
import { BadRequest, NotFound } from '../types/error'

export const getUserHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  if (!req.params.id) {
    throw new BadRequest('"id" is not found in params', req)
  }
  const userId = Number(req.params.id)
  if (isNaN(userId)) {
    throw new NotFound('user is not found')
  }
  const user = await getUserWithoutPassword({ id: userId })
  if (user === null) {
    throw new NotFound('user is not found')
  }
  return { data: user, status: 200 }
}
