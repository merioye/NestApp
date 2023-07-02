import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cookieParser from 'cookie-parser'
import { join } from 'path'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useStaticAssets(join(__dirname, '../uploads'))

  const configService = app.get(ConfigService)
  await app.listen(configService.get<number>('PORT'))
}
bootstrap()
