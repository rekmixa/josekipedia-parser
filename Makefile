rm-git:
	@rm -rf .git

clean-data:
	@rm -rf data/moves/*

up:
	@docker-compose up -d

env:
	@docker-compose run --rm node bash

logs:
	@docker-compose logs -f --tail=1000 node
