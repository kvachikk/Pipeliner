[![Licence](https://img.shields.io/github/license/Ileriayo/markdown-badges?style=for-the-badge)](./LICENSE)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

# ІС-34 Погорілець Владислав (NodeJS)

# Pipeliner 

High-performance Node.js backend for fast RSS content aggregation and delivery.

**Pipeliner** is a full-stack RSS reader and content aggregator. It is built using the **NestJS** framework and is designed to efficiently pipeline data from various sources (starting with RSS feeds) directly to the end-user.

This project is being developed as part of a university Node.js course, covering the entire software development lifecycle: from initial setup and architecture to advanced testing, CI/CD, and performance optimization.

## Core Functionality

* **Feed Management:** A RESTful API (documented via **Swagger**) for adding, removing, and grouping RSS feeds.
* **Content Aggregation:** A background scheduler (`@nestjs/schedule`) periodically polls all registered RSS feeds, parses them, and stores new articles.
* **Data Persistence:** All users, subscriptions, and articles are stored in a **PostgreSQL** database managed by the **Sequelize** ORM.
* **Fast Caching:** **Redis** is used to cache frequently accessed data (such as hot articles or user sessions) to reduce database load.
* **Authentication:** (Planned) A full-featured user authentication system to store personal subscriptions.

## Future Plans

The initial focus is on RSS, but the architecture is designed for extensibility.

* **"Any-Source" Reader:** Evolve beyond RSS to aggregate content from other sources, such as Twitter, Reddit, or Telegram channels.
* **Module Refactoring:** Identify core modules (e.g., parsing logic) and extract them into separate, independent libraries.
* **Performance Optimization:** Conduct in-depth performance analysis and resolve identified bottlenecks.
* **Full E2E Testing:** Expand the **Playwright** test suite to cover all critical user scenarios.

## Tooling & Tech Stack

- runtime - `Node.js`
- language - `TypeScript`
- framework - `NestJS`
- package management - `npm`

<br/>

- linting - `ESLint`
- formatting - `Prettier`
- configurations - `dotenv`
- API documentation - `Swagger (via @nestjs/swagger)`

<br/>

- CI/CD - `GitHub Actions`
- containerization - `Docker, docker-compose`
- logging - `Winston, nest-winston`
- caching - `Redis (via cache-manager, cache-manager-redis-store, ioredis)`

<br/>

- ORM - `Sequelize, sequelize-typescript`
- database - `PostgreSQL (main), SQLite (for tests)`
- database migration - `Umzug (via Sequelize CLI)`

<br/>

- validation - `Joi`
- templating - `Handlebars`
- scheduling - `@nestjs/schedule`
- Unit & e2e testing - `Jest, @nestjs/testing, supertest`
- UI e2e testing - `Playwright (@playwright/test, playwright)`
- architecture testing - `Dependency Cruiser (dependency-cruiser)`

<br/>

- static file serving -` @nestjs/serve-static`