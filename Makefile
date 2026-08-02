.PHONY: help up down rebuild logs check

help:
	@echo "make up       Start the local Apache/PHP/MySQL stack"
	@echo "make down     Stop the local stack"
	@echo "make rebuild  Rebuild and start the local stack"
	@echo "make logs     Follow container logs"
	@echo "make check    Run local JavaScript and PHP syntax checks"

up:
	docker compose up --build -d

down:
	docker compose down

rebuild:
	docker compose down
	docker compose up --build -d

logs:
	docker compose logs -f

check:
	node --check js/main.js
	php -l php/contact.php
	php -l php/config.example.php
