all: up logs

rm-git:
	@rm -rf .git

clean-data:
	@rm -rf data/moves/*

up:
	@docker-compose up -d

stop:
	@docker-compose stop

down:
	@docker-compose down

env:
	@docker-compose run --rm node bash

logs:
	@docker-compose logs -f --tail=1000 node
