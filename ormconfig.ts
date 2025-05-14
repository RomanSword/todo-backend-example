import { DataSource } from 'typeorm';

import { Todo } from './src/todos/entities/todo.entity';
import { User } from './src/users/entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'brotherhood',
  database: 'todo_list',
  entities: [Todo, User],
  migrations: ['src/common/migrations/*.ts'],
  synchronize: false // отключено в продакшене
});
