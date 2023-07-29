/* eslint-disable import/order */
import { getAllUsers, getUser } from './user'

jest.mock('../lib/prisma', () => {
  return {
    prisma: {
      user: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
    },
  }
})
import { prisma } from '../lib/prisma'

describe('getUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get user', async () => {
    const mockUser = { id: 'userid', name: 'username' }
    const findFirst = prisma.user.findFirst as jest.Mock
    findFirst.mockResolvedValue(mockUser)

    const user = await getUser({ id: 1 })

    // user to equal
    expect(user).toEqual(mockUser)

    // call count function
    expect(findFirst).toHaveBeenCalledTimes(1)

    // passed argument
    const [arg1] = findFirst.mock.calls[0]
    expect(arg1).toEqual({ where: { id: 1 } })
  })
})

describe('getAllUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get users', async () => {
    const mockUsers = [
      { id: 'userid', name: 'username' },
      { id: 'userid2', name: 'username2' },
    ]
    const findMany = prisma.user.findMany as jest.Mock
    findMany.mockResolvedValue(mockUsers)

    const users = await getAllUsers()

    // user to equal
    expect(users).toEqual(mockUsers)

    // call count function
    expect(findMany).toHaveBeenCalledTimes(1)

    // passed argument
    const [arg1] = findMany.mock.calls[0]
    expect(arg1).toEqual({ skip: undefined, take: undefined })
  })

  it('should get users and passed arguments', async () => {
    const mockUsers = [
      { id: 'userid', name: 'username' },
      { id: 'userid2', name: 'username2' },
    ]
    const findMany = prisma.user.findMany as jest.Mock
    findMany.mockResolvedValue(mockUsers)

    const users = await getAllUsers(1, 1)

    // user to equal
    expect(users).toEqual(mockUsers)

    // call count function
    expect(findMany).toHaveBeenCalledTimes(1)

    // passed argument
    const [arg1] = findMany.mock.calls[0]
    expect(arg1).toEqual({ skip: 1, take: 1 })
  })
})
