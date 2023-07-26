import Express from 'express'
import { getEnvConfig } from './utils/config'

const envConfig = getEnvConfig(process.env.NODE_ENV)
const app = Express()

app.listen(envConfig.app.port, () => {
  console.log(`Listen start port ${envConfig.app.port}`)
})
