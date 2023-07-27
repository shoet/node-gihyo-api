import express from 'express'
import bodyParser from 'body-parser'

import { logRequestMiddleware } from './handlers/logger'
import {
  internalErrorMiddleware,
  notfoundErrorMiddleware,
  tryWrapAPI,
} from './handlers/error'

import { getUserHandler } from './handlers/user'

import { getEnvConfig } from './utils/config'
import * as http from 'http'

import * as dotenv from 'dotenv'
import { getProductListHandler, getProductHandler } from './handlers/product'

dotenv.config()

console.log(process.env.DATABASE_URL)

const envConfig = getEnvConfig(process.env.NODE_ENV)
const app = express()
const server = http.createServer(app)

// Utility Middlewares ---------------------------------------------
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)
app.use(bodyParser.json())
app.use(logRequestMiddleware)

// Route Handlers --------------------------------------------------
app.get('/users/:id', tryWrapAPI(getUserHandler))
app.get('/products/:id', tryWrapAPI(getProductHandler))
app.get('/products', tryWrapAPI(getProductListHandler))

// Error Middlewares ----------------------------------------------------
app.use(notfoundErrorMiddleware)
app.use(internalErrorMiddleware)

// Server Settings -----------------------------------------------------
app.listen(envConfig.app.port, () =>
  console.log(`listen start port ${envConfig.app.port}`),
)

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
