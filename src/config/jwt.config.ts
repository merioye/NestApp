import { ConfigService } from '@nestjs/config'

export const jwtConfig = {
  useFactory: (configService: ConfigService) => {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: configService.get<string>('JWT_EXPIRATION'),
      },
    }
  },
  inject: [ConfigService],
}
