import * as config from '../../config.json'

export const getEnvConfig = (environment: string | undefined) => {
  if (environment === undefined) {
    throw new Error('NODE_ENV is undefined')
  }
  const envConfig = (config as any)[environment]
  if (!envConfig) {
    throw new Error(`Environment [${environment}] is not found`)
  }
  return envConfig
}
