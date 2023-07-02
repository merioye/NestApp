import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { SigninDto, SignupDto } from './dtos'
import { fileValidationConfig, multerConfig } from '../config'
import { User } from '../users/entities'
import { CurrentUserId, Serialize } from '../decorators'
import { UserDto } from '../users/dtos'
import { AuthGuard } from '../guards'

@Controller('auth')
@Serialize(UserDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  signup(
    @UploadedFile(fileValidationConfig) avatar: Express.Multer.File,
    @Body() body: SignupDto,
  ): Promise<User> {
    return this.authService.signup({ ...body, avatar: avatar.filename })
  }

  @Post('signin')
  @HttpCode(200)
  signin(
    @Res({ passthrough: true }) res: Response,
    @Body() body: SigninDto,
  ): Promise<User> {
    return this.authService.signin(res, body)
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) res: Response): string {
    return this.authService.logout(res)
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUserId() id: string): Promise<User> {
    return this.authService.whoAmI(id)
  }
}
