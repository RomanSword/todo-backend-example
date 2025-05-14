import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Todo } from './entities/todo.entity';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>
  ) {}

  findAll(): Promise<Todo[]> {
    return this.repo.find();
  }

  async findOne(
    id: number,
    ignoreError: boolean = false
  ): Promise<Todo | null> {
    const todo = await this.repo.findOne({ where: { id } });

    if (!todo && !ignoreError) {
      throw new NotFoundException('todo not found');
    }

    return todo;
  }

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.repo.create({
      ...createTodoDto,
      isDone: false
    });

    return this.repo.save(todo);
  }

  async update(id: number, updateDto: UpdateTodoDto): Promise<Todo | null> {
    await this.repo.update(id, updateDto);

    return this.findOne(id);
  }

  async remove(id: number, ignoreError: boolean = false): Promise<boolean> {
    const result = await this.repo.delete(id);
    const affected = result?.affected || 0;

    if (!affected && !ignoreError) {
      throw new NotFoundException('todo not found');
    }

    return affected > 0;
  }
}
