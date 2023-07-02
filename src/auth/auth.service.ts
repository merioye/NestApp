import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common'
import { Response } from 'express'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities'
import { hash, compare } from '../helpers'
import { SigninDto } from './dtos'
import { Environment } from '../users/constants'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(data: Omit<User, 'id'>): Promise<User> {
    const { email, password } = data
    const user = await this.usersService.findOne({ where: { email } })
    if (user) {
      throw new ConflictException('User already exists')
    }

    const hashedPassword = hash(password)

    return this.usersService.create({ ...data, password: hashedPassword })
  }

  async signin(res: Response, data: SigninDto): Promise<User> {
    const { email, password } = data
    const user = await this.usersService.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException()
    }

    const isMatched = compare(password, user.password)
    if (!isMatched) {
      throw new UnauthorizedException()
    }

    const payload = { userId: user.id }
    const accessToken = await this.jwtService.signAsync(payload)

    const isProduction =
      this.configService.get<string>('NODE_ENV') === Environment.PROD
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(
        Date.now() + this.configService.get<number>('JWT_COOKIE_EXPIRATION'),
      ),
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
    })

    return user
  }

  logout(res: Response): string {
    res.clearCookie('accessToken')
    return 'Logout successfull'
  }

  whoAmI(id: string): Promise<User> {
    return this.usersService.findOne({ where: { id } })
  }
}
