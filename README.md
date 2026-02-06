# This new game template

Nuxt 4 / Vue 3 приложение для игры «Game».
Репозиторий содержит полный фронтенд-стек, Makefile для обёртки docker-compose и инфраструктурные файлы в каталоге `.docker`.

## Содержание

- [Технологии](#технологии)
- [Требования](#требования)
- [Установка зависимостей](#установка-зависимостей)
- [Локальная разработка без Docker](#локальная-разработка-без-docker)
- [Развёртывание через Docker и Makefile](#развёртывание-через-docker-и-makefile)
- [Полезные директории](#полезные-директории)

## Технологии

- [Nuxt 4](https://nuxt.com/) + Vue 3 + TypeScript
- [Pinia](https://pinia.vuejs.org/) для стейта, [VueUse](https://vueuse.org/) для утилит
- Tailwind CSS, @nuxt/fonts, мультиязычность через `@nuxtjs/i18n`
- ESLint + Prettier + lint-staged для контроля качества

## Требования

- Node.js ≥ 20 (LTS)
- Yarn (classic) ≥ 1.22
- GNU Make и Docker + Docker Compose (нужны для секции развёртывания)

## Установка зависимостей

```bash
yarn install
```

После установки будет автоматически выполнен `nuxt prepare` (см. `postinstall`).

## Локальная разработка без Docker

1. При необходимости создайте `.env` в корне (Nuxt читает `NUXT_PUBLIC_*`, например `NUXT_PUBLIC_SENTRY_DSN`, `NUXT_PUBLIC_YANDEX_METRIKA_ID`, `NUXT_PUBLIC_GOOGLE_ANALYTICS_ID`).
2. Запустите режим разработки:

    ```bash
    yarn dev
    ```

3. Дополнительные скрипты:
    - `yarn lint` / `yarn lint:fix` — проверка и автоисправление ESLint.
    - `yarn format` / `yarn format:check` — Prettier для форматирования.
    - `yarn build` — production-сборка Nuxt.
    - `yarn preview` — предпросмотр уже собранного приложения.

Такой сценарий позволяет быстро разрабатывать UI без запуска Docker. Docker можно подключить позже для проверки инфраструктурных настроек.

## Развёртывание через Docker и Makefile

Все docker-compose конфигурации и вспомогательные скрипты лежат в `.docker/`:

| Файл                                  | Назначение                                                                                                                             |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `.docker/.env.example`                | Базовый набор переменных (`APP_VERSION`, `APP_EXTERNAL_PORT`, идентификаторы аналитики). Скопируйте в `.docker/.env` и отредактируйте. |
| `docker-compose.local.yml`            | Локальная разработка в Docker. Собирает `Dockerfile`, монтирует проект и пробрасывает 3000 порт.                                       |
| `docker-compose.production.base.yml`  | Общая часть конфигурации production (лимиты, переменные окружения, порты).                                                             |
| `docker-compose.production.build.yml` | Расширяет base и собирает образ из `Dockerfile.production`.                                                                            |
| `docker-compose.production.image.yml` | Используется, когда образ уже собран и доступен в реестре.                                                                             |
| `scripts/set-image-version.sh`        | Утилита для быстрой правки `APP_VERSION` в `.docker/.env`.                                                                             |

`Makefile` оборачивает наиболее часто используемые сценарии. Посмотреть весь список можно через `make help`. Ключевые цели:

| Цель                                                                                     | Что делает                                                                                                                             |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `make set-image-version VERSION=v1.2.3`                                                  | Обновляет `APP_VERSION` в `.docker/.env`, чтобы задать тег образа.                                                                     |
| `make start-from-local`                                                                  | Собирает контейнер по `docker-compose.local.yml` и запускает проект в фоне.                                                            |
| `make stop-local` / `make down-local`                                                    | Останавливает или полностью удаляет локальные контейнеры/сеть.                                                                         |
| `make restart-local`                                                                     | Быстрый рестарт локального контейнера.                                                                                                 |
| `make start-from-production-build`                                                       | Собирает production-образ на месте и стартует сервис (base + build).                                                                   |
| `make start-from-production-image`                                                       | Запускает сервис из уже готового образа (base + image).                                                                                |
| `make stop-production` / `make down-production` / `make restart-production`              | Управление production-композом.                                                                                                        |
| `make pull-production-image-from-registry URL=… USERNAME=… PASSWORD=… IMAGE=… VERSION=…` | Вытягивает образ из реестра, логинится, переименовывает в `winnery.cucaracha-sprint-shootout.frontend:VERSION` и чистит временный тег. |
| `make frontend`                                                                          | Входит в контейнер (`docker exec`).                                                                                                    |
| `make frontend-logs` / `make frontend-restart`                                           | Логи и перезапуск фронтенд-контейнера.                                                                                                 |
| `make frontend-copy-deps`                                                                | Копирует `node_modules` из контейнера на хост (полезно в dev-режиме).                                                                  |

### Типовой сценарий локального запуска в Docker

```bash
cp .docker/.env.example .docker/.env
make set-image-version VERSION=dev
make start-from-local
```

После этого фронтенд будет доступен на `http://localhost:${APP_EXTERNAL_PORT}` (по умолчанию 26280, подменить можно в `.docker/.env`). Остановить контейнер: `make stop-local` или `make down-local`.

### Production сценарии

- **Собрать и запустить на сервере**:

    ```bash
    make set-image-version VERSION=v1.4.0
    make start-from-production-build
    ```

- **Использовать готовый образ** (например, из CI/CD):

    ```bash
    make pull-production-image-from-registry URL=registry.example.com USERNAME=ci PASSWORD=*** IMAGE=registry.example.com/cucaracha-frontend VERSION=v1.4.0
    make start-from-production-image
    ```

`Dockerfile` предназначен для разработки (монтируется весь проект), а `Dockerfile.production` — многоэтапная сборка оптимизированного образа для публикации.

## Полезные директории

- `app/` — исходники Nuxt (страницы, компоненты, сторак и т.д.).
- `public/` — статические ассеты, раздаются как есть.
- `docs/` — дополнительные материалы и справки.
- `i18n/` — словари для `@nuxtjs/i18n`.

## Подсказки по дальнейшей работе

- Перед коммитом автоматически срабатывает `lint-staged` (`simple-git-hooks`). Убедитесь, что `yarn lint` и `yarn format:check` проходят локально.
- При изменении образа не забывайте обновлять `APP_VERSION`, чтобы отличать сборки в реестре.
