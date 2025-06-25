all: up logs

rm-git:
	@rm -rf .git

clean-data:
	@rm -rf data/moves/*

size:
	@du -sh data

up:
	@docker-compose up -d

stop:
	@docker-compose stop

restart:
	@docker-compose restart

down:
	@docker-compose down

env:
	@docker-compose run --rm node bash

logs:
	@docker-compose logs -f --tail=1000 node
