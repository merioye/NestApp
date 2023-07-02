import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { resolve } from 'path'
import { unlinkSync } from 'fs'
import { User } from './entities'
import { hash } from '../helpers'

interface UpdateParam {
  currentUserId: string
  filter: FindOptionsWhere<User>
  update: Partial<Omit<User, 'id' | 'avatar'>>
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  create(user: Omit<User, 'id'>): Promise<User> {
    const newUser = this.usersRepo.create(user)
    return this.usersRepo.save(newUser)
  }

  findOne(filter: FindOneOptions<User>): Promise<User | null> {
    return this.usersRepo.findOne(filter)
  }

  find(filter: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepo.find(filter)
  }

  async findOneOrThrow(filter: FindOneOptions<User>): Promise<User> {
    const user = await this.findOne(filter)
    if (!user) {
      throw new NotFoundException()
    }
    return user
  }

  async update(param: UpdateParam): Promise<User> {
    const { currentUserId, filter, update } = param
    const user = await this.findOneOrThrow({ where: filter })
    if (user.id !== currentUserId) {
      throw new ForbiddenException()
    }
    if (update.password) {
      update.password = hash(update.password)
    }

    for (const userAttr in update) {
      user[userAttr] = update[userAttr]
    }

    return this.usersRepo.save(user)
  }

  async remove(param: Omit<UpdateParam, 'update'>): Promise<User> {
    const { currentUserId, filter } = param
    const user = await this.findOneOrThrow({ where: filter })
    if (user.id !== currentUserId) {
      throw new ForbiddenException()
    }
    const removedUser = await this.usersRepo.remove(user)
    unlinkSync(resolve(process.cwd(), `./uploads/${removedUser.avatar}`))
    return removedUser
  }
}
