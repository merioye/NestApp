import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './entities'
import { CurrentUserId, Serialize } from '../decorators'
import { UpdateUserDto, UserDto } from './dtos'
import { AuthGuard } from '../guards'

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.find({})
  }

  @Get(':id')
  getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const filter = { where: { id } }
    return this.usersService.findOneOrThrow(filter)
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  updateUser(
    @CurrentUserId() currentUserId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update({
      currentUserId,
      filter: { id },
      update: body,
    })
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  removeUser(
    @CurrentUserId() currentUserId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.remove({ currentUserId, filter: { id } })
  }
}
