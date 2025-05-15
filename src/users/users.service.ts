import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RegisterDto } from 'src/auth/dto/register.dto';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const HASH_ROUNDS = 10;
const NOT_UNIQUE_ERROR_SQL_CONSTRAINT = '23505';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(
    id: string,
    ignoreError: boolean = false
  ): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id } });

    if (!user && !ignoreError) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async register({ username, password, email }: RegisterDto): Promise<User> {
    const hashed = await bcrypt.hash(password, HASH_ROUNDS);
    const user = this.repo.create({
      username,
      email,
      password: hashed,
      isAdmin: false,
      isMentor: false
    });

    try {
      return await this.repo.save(user);
    } catch (error) {
      if (error.code === NOT_UNIQUE_ERROR_SQL_CONSTRAINT) {
        throw new ConflictException('username already taken');
      }

      throw error;
    }
  }

  async create(createDto: CreateUserDto): Promise<User> {
    const hashed = await bcrypt.hash(createDto.password, HASH_ROUNDS);
    const user = this.repo.create({
      ...createDto,
      password: hashed
    });

    return this.repo.save(user);
  }

  async update(
    id: string,
    updateDto: UpdateUserDto,
    ignoreOldPassword: boolean = false // Админ может игнорировать старый пароль
  ): Promise<User | null> {
    const {
      oldPassword: plainOldPassword,
      refreshToken, // Токена не будет в dto, но обезопасим себя лишний раз
      ...restUpdateDto
    } = updateDto;

    const user = await this.findOne(id);

    if (restUpdateDto.password) {
      const newPassword = await bcrypt.hash(
        restUpdateDto.password,
        HASH_ROUNDS
      );

      if (ignoreOldPassword) {
        restUpdateDto.password = newPassword;
      } else if (plainOldPassword && restUpdateDto.password && user?.password) {
        const isMatch = await bcrypt.compare(plainOldPassword, user.password);

        if (isMatch) {
          restUpdateDto.password = newPassword;
        } else {
          throw new ConflictException('incorrect old password');
        }
      }
    }

    const updatedUser = { ...user, ...restUpdateDto };

    try {
      await this.repo.update(id, updatedUser);
    } catch (error) {
      if (error.code === NOT_UNIQUE_ERROR_SQL_CONSTRAINT) {
        throw new ConflictException('username already taken');
      }

      throw error;
    }

    return this.findOne(id);
  }

  async updateRefreshToken(
    id: string,
    refreshToken: string
  ): Promise<User | null> {
    await this.repo.update(id, { refreshToken });

    return this.findOne(id);
  }

  async remove(id: string, ignoreError: boolean = false): Promise<boolean> {
    const result = await this.repo.delete(id);
    const affected = result?.affected || 0;

    if (!affected && !ignoreError) {
      throw new NotFoundException('user not found');
    }

    return affected > 0;
  }
}
