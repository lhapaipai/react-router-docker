local_path		:= $(PWD)
remote_path		:= ~/app


.PHONY: docker-dev docker-prod docker-prod-refresh-front

docker-dev:
	docker compose up -d db db-migration

docker-prod:
	docker compose up -d

build-front:
	docker compose build front
	docker push rg.fr-par.scw.cloud/pentatrion/rr-front:latest

docker-prod-refresh-front:
	docker compose up -d --no-deps --force-recreate front

deploy-compose:
	rsync -av \
		--exclude-from .rsyncignore \
		$(local_path)/compose*.yaml \
		millau:$(remote_path)
