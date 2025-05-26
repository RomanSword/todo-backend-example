import { DataSource, DataSourceOptions } from 'typeorm';

// Какая переменная окружения соответствует полю в конфиге ORM
const dbEnvFields: Record<string, string[]> = {
  POSTGRES_HOST: ['string', 'host'],
  POSTGRES_INNER_PORT: ['number', 'port'],
  POSTGRES_DB: ['string', 'database'],
  POSTGRES_USER: ['string', 'username'],
  POSTGRES_PASSWORD: ['string', 'password']
};

// Создаем дефолтный конфиг для ORM
export const typeOrmConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'test',
  database: 'test_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development' // Только для разработки
};

// Пытаемся наполнить конфиг из переменных окружения
for (const dbKey in dbEnvFields) {
  if (process.env[dbKey]) {
    const typeValue = dbEnvFields[dbKey][0];
    const value = dbEnvFields[dbKey][1];

    typeOrmConfig[value] =
      typeValue === 'string'
        ? process.env[dbKey]
        : parseInt(process.env[dbKey]);
  } else {
    console.log(`Env DB key warning: ${dbKey} is not exists`);
  }
}

console.log('TypeORM config: ', typeOrmConfig);

export default new DataSource({
  ...typeOrmConfig,
  migrations: ['src/common/migrations/*.ts']
});
