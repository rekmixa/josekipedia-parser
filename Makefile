rm-git:
	@rm -rf .git

clean-data:
	@rm -rf data/moves/*

env:
	@docker-compose run --rm node bash

logs:
	@docker-compose logs -f --tail=1000 node
