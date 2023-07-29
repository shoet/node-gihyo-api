import express from 'express'
import * as http from 'http'
import * as dotenv from 'dotenv'
import { morgan } from './lib/morgan'

import {
  internalErrorMiddleware,
  notfoundErrorMiddleware,
  tryWrapAPI,
} from './handlers/error'

import { getUserHandler } from './handlers/user'

import { getEnvConfig } from './utils/config'
import { getProductListHandler, getProductHandler } from './handlers/product'
import { signInHandler, signUpHandler } from './handlers/auth'

dotenv.config()

console.log(process.env.DATABASE_URL)

const envConfig = getEnvConfig(process.env.NODE_ENV)
const app = express()
const server = http.createServer(app)

// Utility Middlewares ---------------------------------------------
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan)


// Route Handlers --------------------------------------------------
app.get('/users/:id', tryWrapAPI(getUserHandler))
app.get('/products/:id', tryWrapAPI(getProductHandler))
app.get('/products', tryWrapAPI(getProductListHandler))

app.post('/auth/signup', tryWrapAPI(signUpHandler))
app.post('/auth/signin', tryWrapAPI(signInHandler))
// Error Middlewares ----------------------------------------------------
app.use(notfoundErrorMiddleware)
app.use(internalErrorMiddleware)

// Server Settings -----------------------------------------------------
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
