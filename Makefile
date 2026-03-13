.DEFAULT_GOAL := help

DOCKER_COMPOSE_CMD := $(shell command -v docker compose >/dev/null 2>&1 && echo "docker compose" || echo "docker-compose")
DOCKER_COMPOSE := cd .docker && $(DOCKER_COMPOSE_CMD)

help:
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z0-9_-]+:.*?##/ { printf "  \033[36m%-27s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Setup

.PHONY: set-image-version
set-image-version: ## Set backend version (branch, tag, commit): VERSION=v1.1.0
	sh ./.docker/scripts/set-image-version.sh VERSION=$(VERSION)


##@ Docker (local)

.PHONY: down-local
down-local: ## Down backend service
	$(DOCKER_COMPOSE) -f docker-compose.local.yml down

.PHONY: stop-local
stop-local: ## Stop backend service
	$(DOCKER_COMPOSE) -f docker-compose.local.yml stop

.PHONY: restart-local
restart-local: ## Restart backend service
	$(DOCKER_COMPOSE) -f docker-compose.local.yml restart

.PHONY: start-from-local
start-from-local: ## Start backend in development environment
	$(DOCKER_COMPOSE) -f docker-compose.local.yml up -d


##@ Docker (production)

.PHONY: down-production
down-production: ## Down backend service
	$(DOCKER_COMPOSE) -f docker-compose.production.base.yml down

.PHONY: stop-production
stop-production: ## Stop backend service
	$(DOCKER_COMPOSE) -f docker-compose.production.base.yml stop

.PHONY: restart-production
restart-production: ## Restart backend service
	$(DOCKER_COMPOSE) -f docker-compose.production.base.yml restart

.PHONY: start-from-production-build
start-from-production-build: ## Start backend in production environment from build
	$(DOCKER_COMPOSE) -f docker-compose.production.base.yml -f docker-compose.production.build.yml up -d

.PHONY: start-from-production-image
start-from-production-image: ## Start backend in production environment from image
	$(DOCKER_COMPOSE) -f docker-compose.production.base.yml -f docker-compose.production.image.yml up -d

.PHONY: pull-production-image-from-registry
pull-production-image-from-registry: ## Pull backend image from registry: URL, USERNAME, PASSWORD, IMAGE, VERSION
	echo $(PASSWORD) | docker login ${URL} --username ${USERNAME} --password-stdin &&\
	docker pull ${IMAGE}:${VERSION} &&\
	docker logout ${URL} &&\
	docker tag ${IMAGE}:${VERSION} winnery.space-rocket.frontend:${VERSION} &&\
	docker rmi ${IMAGE}:${VERSION}


##@ Frontend

.PHONY: frontend
frontend: ## Enter backend container
	docker exec -it winnery.space-rocket.frontend sh

.PHONY: frontend-logs
frontend-logs: ## Logs backend service
	docker logs -f --tail=10 winnery.space-rocket.frontend

.PHONY: frontend-restart
frontend-restart: ## Restart backend container
	docker restart winnery.space-rocket.frontend

.PHONY: frontend-copy-deps
frontend-copy-deps: ## Copy composer vendor dependencies from container to host machine (relevant to dev mode)
	docker cp winnery.space-rocket.frontend:/dependencies/node_modules .
