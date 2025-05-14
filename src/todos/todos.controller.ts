import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard';

@ApiTags('Todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(AuthTokenGuard)
  @Get()
  @ApiOperation({ summary: 'Получить все тудушки' })
  findAll() {
    return this.todosService.findAll();
  }

  @UseGuards(AuthTokenGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Найти конкретную тудушку' })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  @UseGuards(AuthTokenGuard)
  @Post()
  @ApiOperation({ summary: 'Создать тудушку' })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create({ ...createTodoDto, isDone: false });
  }

  @UseGuards(AuthTokenGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Обновить тудушку' })
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(+id, updateTodoDto);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить тудушку' })
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }
}
