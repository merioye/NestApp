import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { jwtConfig } from '../config'

@Module({
  imports: [JwtModule.registerAsync(jwtConfig), UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
