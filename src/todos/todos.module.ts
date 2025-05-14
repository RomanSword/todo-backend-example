import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';

import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { Todo } from './entities/todo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo]), forwardRef(() => AuthModule)],
  controllers: [TodosController],
  providers: [TodosService]
})
export class TodosModule {}
