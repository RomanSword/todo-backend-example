## Описание

Базовый backend на [Nest](https://github.com/nestjs/nest) с авторизацией, работой с пользовалем и todoшками.

## Установка

```bash
$ npm install
```

## Сборка и запуск проекта

```bash
$ npm run start:dev
```

```bash
$ npm run start:prod
```

## Что интересного внутри?

1. БД - PostgreSQL, ORM, Миграции - TypeORM
2. Авторизация реализована на access и refresh jwt токенах. Токены помещаются в cookie.
3. Есть разделение на администратора и обычного пользователя по access.guard
4. Используются DTO объекты на базе class-validator
5. Используется сериализация DTO объектов, отдаваемых с endpoint'ов на базе class-transformer
6. Есть Swagger
7. Есть базовый логгер
8. Все в докере, есть сервисы: postgres, pgadmin и backend. Все работает через makefile
