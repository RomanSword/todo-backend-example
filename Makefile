# Имя docker-compose файла
COMPOSE_FILE=docker-compose.yml

# Список сервисов, через запятую, например: backend postgres pgadmin
SERVICES=backend postgres pgadmin

# Команда для запуска всех сервисов в фоне
up:
	docker-compose -f $(COMPOSE_FILE) up -d

logs:
	docker-compose logs -f backend postgres

# Команда для пересборки и перезапуска всех сервисов
rebuild:
	docker-compose -f $(COMPOSE_FILE) up --build -d

# Команда для остановки и удаления всех сервисов
down:
	docker-compose -f $(COMPOSE_FILE) down

# Присоединиться к консоли (bash или sh) определенного сервиса
# Использование: make shell SERVICE=backend
shell:
	docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) sh || docker-compose -f $(COMPOSE_FILE) exec $(SERVICE) bash

# Удалить все остановленные контейнеры, сети, образы и тома (опасно!)
clean:
	docker system prune -af --volumes

# Показать список работающих контейнеров
ps:
	docker-compose -f $(COMPOSE_FILE) ps
