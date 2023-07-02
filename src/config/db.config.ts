import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { User } from '../users/entities'

export const dbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USERNAME'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      database: configService.get<string>('POSTGRES_DB'),
      synchronize: configService.get<string>('NODE_ENV') !== 'production',
      entities: [User],
    }
  },
  inject: [ConfigService],
}
