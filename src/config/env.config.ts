import * as Joi from 'joi'
import { Environment } from '../users/constants'

export const envConfig = {
  isGlobal: true,
  validationSchema: Joi.object({
    SERVER_BASE_URL: Joi.string().required(),
    PORT: Joi.number().default(5000),
    NODE_ENV: Joi.string()
      .valid(Environment.DEV, Environment.TEST, Environment.PROD)
      .required(),
    POSTGRES_HOST: Joi.string().default('localhost'),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_USERNAME: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().required(),
    JWT_COOKIE_EXPIRATION: Joi.number().required(),
  }),
}
