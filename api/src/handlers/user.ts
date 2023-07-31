/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import {
  getAllUsersWithoutPassword,
  getUserWithoutPassword,
} from '../models/user'
import { ApiResponse } from '../types/api'
import { BadRequest, NotFound, Unauthorized } from '../types/error'
import { verifyToken } from '../utils/http'

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

export const getAllUsersHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const user = await getAllUsersWithoutPassword()
  if (user === null) {
    throw new NotFound('user is not found')
  }
  return { data: user, status: 200 }
}

export const getUserMeHandler = async (
  req: Request,
  _res: Response,
  _next: NextFunction,
): Promise<ApiResponse> => {
  const token = req.cookies['token']
  if (!token) {
    throw new Unauthorized('Unauthorized')
  }
  const decodedPayload = verifyToken(token)
  const userId = Number(decodedPayload)
  const user = await getUserWithoutPassword({ id: userId })
  if (user === null) {
    throw new BadRequest('user is not found', req)
  }
  return { data: user, status: 200 }
}
