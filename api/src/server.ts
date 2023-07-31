import express, { NextFunction, Request, Response } from 'express'
import * as http from 'http'
import * as dotenv from 'dotenv'
import { morgan } from './lib/morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import {
  internalErrorMiddleware,
  tryWrapAPI,
  AuthGuard,
} from './handlers/error'

import {
  getAllUsersHandler,
  getUserHandler,
  getUserMeHandler,
} from './handlers/user'

import { getEnvConfig } from './utils/config'
import { getProductListHandler, getProductHandler } from './handlers/product'
import { signInHandler, signUpHandler } from './handlers/auth'

dotenv.config()

const envConfig = getEnvConfig(process.env.NODE_ENV)
const app = express()
const server = http.createServer(app)

// Utility Middleware ---------------------------------------------
app.use(cookieParser())
const corsOptions = {
  ...(process.env.CLIENT_URL ? { origin: process.env.CLIENT_URL } : {}),
  credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan)

// app.use(helmet())
// app.use(session()) // express-session

// Route Handler --------------------------------------------------
app.get('/users/me', AuthGuard, tryWrapAPI(getUserMeHandler))
app.get('/users/:id', AuthGuard, tryWrapAPI(getUserHandler))
app.get('/users', AuthGuard, tryWrapAPI(getAllUsersHandler))
app.get('/products/:id', AuthGuard, tryWrapAPI(getProductHandler))
app.get('/products', AuthGuard, tryWrapAPI(getProductListHandler))

app.post('/auth/signup', tryWrapAPI(signUpHandler))
app.post('/auth/signin', tryWrapAPI(signInHandler))
// app.post('/auth/signout')
// app.post('/purchase')
// app.post('/users/me')

// Error Middleware ----------------------------------------------------
app.use(internalErrorMiddleware)

// Server Setting -----------------------------------------------------
app
  .listen(envConfig.app.port, () =>
    console.log(`Start listening port ${envConfig.app.port}`),
  )
  .on('error', (err) => {
    console.error(err)
    process.exit()
  })

const timeout = 30 * 1000
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('closing server')
  })
  const timer = setTimeout(() => {
    process.exit(1)
  }, timeout)
  timer.unref()
})
