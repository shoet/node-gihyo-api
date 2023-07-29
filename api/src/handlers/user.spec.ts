import { NextFunction, Request, Response } from 'express'
import { getUserHandler } from './user'
import { BadRequest, NotFound } from '../types/error'

jest.mock('../models/user.ts')
import { getUser } from '../models/user'

describe('getUserHandler', () => {
  it('throws BadRequest when id is not include in params', async () => {
    const req: Partial<Request> = { params: {} }
    const res: Partial<Response> = {}
    const next = jest.fn() as NextFunction

    const actual = getUserHandler(req as Request, res as Response, next)

    expect(actual).rejects.toThrow(BadRequest)
  })

  it('throws NotFound when id is not number', async () => {
    const req: Partial<Request> = { params: { id: 'not-number' } }
    const res: Partial<Response> = {}
    const next = jest.fn() as NextFunction

    const actual = getUserHandler(req as Request, res as Response, next)

    expect(actual).rejects.toThrow(NotFound)
  })

  it('throws NotFound when user is not found', async () => {
    const req: Partial<Request> = { params: { id: '1' } }
    const res: Partial<Response> = {}
    const next = jest.fn() as NextFunction

    ;(getUser as jest.Mock).mockResolvedValue(null)

    const actual = getUserHandler(req as Request, res as Response, next)

    expect(actual).rejects.toThrow(NotFound)
  })

  it('returns user when user is found', async () => {
    const req: Partial<Request> = { params: { id: '1' } }
    const res: Partial<Response> = {}
    const next = jest.fn() as NextFunction

    const mockUser = { id: 'userid', name: 'username' }

    const mock_getUser = getUser as jest.Mock

    mock_getUser.mockResolvedValue(mockUser)

    // call count getUser
    expect(mock_getUser).toHaveBeenCalledTimes(1)

    // pass argument getUser
    const [arg1] = mock_getUser.mock.calls[0]
    expect(arg1).toEqual({ id: 1 })

    // found user
    const actual = getUserHandler(req as Request, res as Response, next)
    expect(actual).resolves.toEqual(mockUser)
  })
})
