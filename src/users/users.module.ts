import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from './entities'
import { jwtConfig } from '../config'

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
