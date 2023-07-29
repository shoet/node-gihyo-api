export type ApiResponse = {
  data: any
  status: number
}

declare module 'express' {
  interface Request {
    userId?: number
  }
}
