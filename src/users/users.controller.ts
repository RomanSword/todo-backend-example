import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ParseUUIDPipe,
  Req
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';
import { OnlyForAdmin, Serialize } from 'src/common/decorators';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessGuard } from './guards/access.guard';
import { GetUserDto } from './dto/get-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthTokenGuard)
  @Get()
  @Serialize(GetUserDto)
  @ApiOperation({ summary: 'Получить всех пользователей' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  @Serialize(GetUserDto)
  @ApiOperation({ summary: 'Найти конкретного пользователя' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.usersService.findOne(id);
  }

  @OnlyForAdmin()
  @UseGuards(AuthTokenGuard, AccessGuard)
  @Post()
  @Serialize(GetUserDto)
  @ApiOperation({ summary: 'Создать пользователя' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create({ ...createUserDto });
  }

  @UseGuards(AuthTokenGuard, AccessGuard)
  @Put(':id')
  @Serialize(GetUserDto)
  @ApiOperation({ summary: 'Обновить пользователя' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ) {
    return this.usersService.update(id, updateUserDto, req.user?.isAdmin);
  }

  @OnlyForAdmin()
  @UseGuards(AuthTokenGuard, AccessGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
