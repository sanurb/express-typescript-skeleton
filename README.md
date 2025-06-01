<div align = "center">

<h1><a href="https://github.com/sanurb/ultimate-express-typescript">ultimate-express-typescript</a></h1>

[![Node.js >= 16.0.0](https://img.shields.io/badge/Node.js-%3E=16.0.0-green)](https://nodejs.org)
[![License](https://img.shields.io/github/license/sanurb/ultimate-express-typescript?style=flat&color=eee&label=)](https://github.com/sanurb/ultimate-express-typescript/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/sanurb/ultimate-express-typescript?style=flat&color=ffaaf2&label=People)](https://github.com/sanurb/ultimate-express-typescript/graphs/contributors)
[![Stars](https://img.shields.io/github/stars/sanurb/ultimate-express-typescript?style=flat&color=98c379&label=Stars)](https://github.com/sanurb/ultimate-express-typescript/stargazers)
[![Forks](https://img.shields.io/github/forks/sanurb/ultimate-express-typescript?style=flat&color=66a8e0&label=Forks)](https://github.com/sanurb/ultimate-express-typescript/network/members)
[![Watchers](https://img.shields.io/github/watchers/sanurb/ultimate-express-typescript?style=flat&color=f5d08b&label=Watches)](https://github.com/sanurb/ultimate-express-typescript/watchers)
[![Last Commit](https://img.shields.io/github/last-commit/sanurb/ultimate-express-typescript?style=flat&color=e06c75&label=)](https://github.com/sanurb/ultimate-express-typescript/pulse)

</div>

A high-performance boilerplate for creating TypeScript HTTP servers using [Ultimate Express](https://github.com/dimdenGD/ultimate-express) – a drop-in, faster alternative to Express built on µWebSockets. This project is engineered to save time and eliminate boilerplate by providing a production-ready template with modern tooling, streamlined cloning, and robust configuration.


## Table of Contents

- [Introduction](#introduction)
- [Motivation](#motivation)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Quick Clone with tiged/degit](#quick-clone-with-tigeddegit)
  - [Installation](#installation)
- [Usage](#usage)
  - [Development Mode](#development-mode)
  - [Build & Production](#build--production)
  - [Testing](#testing)
  - [Linting & Formatting](#linting--formatting)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)


## Introduction

The main goal of this project is to provide a base template for the generation of a production-ready REST API made with Node.js, Express and Typescript. The idea is to avoid having to configure all the tools involved in a project every time it is started and thus be able to focus on the definition and implementation of the business logic.

## Motivation

This boilerplate is designed to help you:

- **Accelerate Setup:** Reduce the initial project setup time with a ready-to-go configuration.
- **Enhance Performance:** Replace Express with Ultimate Express for optimized routing and performance.
- **Ensure Consistency:** Leverage modern tools like SWC, Biome, Vitest, and Docker for a consistent development experience.
- **Support Modern Workflows:** Adopt TypeScript best practices and leverage a modular, scalable folder structure.

This is an opinionated template. The architecture of the code base and the configuration of the different tools used has been based on best practices and personal preferences.

## Features

- **Core Framework**: Robust server foundation using **Express.js** (via @reflet/express) with full **TypeScript** support for type safety and scalability.
- **High-Performance Server**: Utilizes **listhen** for fast and efficient HTTP server listening, optimizing response times.
- **Efficient Build Process**: Leverages the **TypeScript Compiler (tsc)** with `tsc-alias` for effective compilation and path alias resolution.
- **Runtime Type Safety**: Implements **Typia** for runtime validation of types, ensuring data integrity throughout your application.
- **Secure Configuration Management**: Uses **dotenv** and **dotenv-expand** for secure and flexible management of environment variables.
- **Advanced Logging**: Integrated **Pino logger** with `pino-pretty` for structured, readable, and high-performance logging.
- **Comprehensive Testing Suite**: Employs **Vitest** for unit and integration testing, supported by **Supertest** for HTTP assertions and **Cucumber** for behavior-driven development.
- **Code Consistency**: Enforces strict code style and formatting using **Biome.js**, maintaining a clean and readable codebase.
- **Dependency Optimization**: Utilizes **Knip** to detect and remove unused files, dependencies, and exports, keeping the project lean.
- **Powerful Task Management**: Automates common development tasks with **Taskfile.yml**, providing a Makefile-like experience for build, test, and deployment workflows.
- **Structured API Design**: Features a well-organized routing system and middleware pipeline for building scalable and maintainable APIs.
- **Centralized Error Handling**: Provides a robust, centralized mechanism for managing and responding to errors gracefully.
- **Containerization Ready**: Includes a **Dockerfile** and Docker-specific tasks in `Taskfile.yml` for easy containerization and deployment.
- **Automated Git Hooks**: Manages Git hooks with **Lefthook**, automating checks and tasks before commits and pushes.
- **Continuous Integration & Delivery (CI/CD)**: Pre-configured **GitHub Actions** for automated linting, testing, and dependency reviews.
- **Modular Architecture**: Employs a clear project structure with **path aliases** (e.g., `@/`, `@contexts/`) for improved code organization and maintainability.
- **OpenAPI Specification**: Includes support for **@samchon/openapi**, facilitating the generation and validation of OpenAPI (Swagger) specifications.


## Getting Started

### Prerequisites

Before you begin, ensure you have the following tools installed:
- Node.js (version specified in `.nvmrc` or `.tool-versions`)
- pnpm (version specified in `packageManager` field in `package.json`)
- Docker

You can verify the presence of these tools by running:
```bash
task requirements
```
This will also check for Node.js, pnpm, and Docker.

### Quick Clone with tiged/degit

For a fast, lightweight clone of this repository (without Git history), use [tiged](https://github.com/tiged/tiged) (or its alias `degit`):
```bash
tiged sanurb/ultimate-express-typescript my-app
```
Alternatively, you can perform a full clone with `git clone`.

### Installation

1.  Navigate to your project directory:
    ```bash
    cd my-app
    ```
2.  Install dependencies and set up the development environment:
    ```bash
    task install
    ```
    This command uses `pnpm install` to download dependencies. `pnpm` will automatically trigger the `prepare` script in `package.json`, which handles tasks like setting up `ts-patch` and creating an initial `.env` file from `.env.example` via `scripts/prepare-env.ts`.

3.  Install Git hooks (recommended for contributing):
    ```bash
    task lefthook.install
    ```

## Usage

This project uses [Taskfile](https://taskfile.dev/) for managing scripts and tasks, similar to Makefiles. All primary operations are defined as tasks in `Taskfile.yml`.

You can list all available tasks by running:
```bash
task help
```

### Development Mode

To start the development server with live compilation (using `tsc`) and auto-reloading (using `node --watch`):
```bash
task dev
```
The server will typically be available at `http://localhost:8080` (or the port defined in your `.env` file).

### Build & Production

**Build:**
To compile the TypeScript code into JavaScript in the `dist/` directory:
```bash
task build
```

**Running in Production (Docker Recommended):**
For production deployments, it's highly recommended to use the provided Docker setup:

1.  Ensure you have an `.env` file configured for your production environment.
2.  Build the Docker image:
    ```bash
    task docker.build
    ```
3.  Run the Docker container:
    ```bash
    task docker.run
    ```
    This will start the container in detached mode.

### Testing

- Run all tests (unit and integration) using Vitest:
  ```bash
  task test
  ```
- Run tests with code coverage (often used in CI environments):
  ```bash
  task test:ci
  ```

### Linting & Formatting

This project uses Biome.js for linting and formatting, and Knip for detecting unused code/dependencies.

- **Linting:**
  ```bash
  task lint        # Check for linting issues
  task lint.fix    # Automatically fix linting issues
  ```
- **Formatting:**
  ```bash
  task format       # Format the codebase
  task format.check # Check if the codebase is correctly formatted
  ```
- **Unused Code Detection (Knip):**
  ```bash
  task lint.knip      # Check for unused files, dependencies, and exports
  task lint.knip.fix  # Remove unused files, dependencies, and exports
  ```

### Docker Commands

The `Taskfile.yml` provides several commands to manage Docker containers:

- `task docker.build`: Builds the Docker image for the application.
- `task docker.run`: Runs the application in a Docker container (requires an `.env` file).
- `task docker.logs`: Tails the logs from the running Docker container.
- `task docker.stop`: Stops and removes the running Docker container.
- `task docker.clean`: Stops and removes the container, the image, and prunes dangling images.

### Other Useful Tasks

- `task help`: Lists all available tasks defined in `Taskfile.yml`.
- `task requirements`: Checks if all necessary tools (Node, pnpm, Docker) are installed.
- `task typecheck`: Runs the TypeScript compiler to check for type errors without emitting files.
- `task audit`: Performs a security audit of project dependencies using `npm audit`.
- `task clean.dist`: Removes the `dist/` directory.
- `task clean.node`: Removes `node_modules/` and `pnpm-lock.yaml`.
- `task clean.all`: Performs a full cleanup (dist, node_modules, Docker resources).
- `task lefthook.install`: Installs Git hooks managed by Lefthook.
- `task deps`: Interactively check and update dependencies using `npm-check-updates` (via pnpm script).



## Project Structure

Below is an overview of the project’s folder structure:

```
.
├── .github/                  # GitHub Actions workflows and repository configurations
│   ├── actions/              # Custom GitHub Actions
│   └── workflows/            # CI/CD pipeline definitions (lint, test, etc.)
├── .vscode/                  # VSCode editor specific settings
├── .zed/                     # Zed editor specific settings
├── assets/                   # Static assets like images, logos
├── dist/                     # Compiled JavaScript output (generated from src/)
├── node_modules/             # Directory where project dependencies are installed (managed by pnpm)
├── scripts/                  # Helper scripts for various tasks
│   ├── prepare-env.ts        # Script for preparing environment configurations
│   └── rm.ts                 # Script for removing files/directories (e.g., cleaning dist/)
├── src/                      # TypeScript source code for the application
│   ├── app.ts                # Application composition root, wires up dependencies
│   ├── index.ts              # Main entry point of the application
│   ├── apps/                 # Houses application-specific logic
│   │   ├── config/           # Configuration files (environments, constants)
│   │   │   ├── constants.ts
│   │   │   └── envs.ts
│   │   ├── core/             # Core business logic, independent of transport layer
│   │   │   └── health/       # Example: Health check domain logic
│   │   └── http/             # HTTP server specific implementation
│   │       ├── middleware/   # Express.js custom middleware
│   │       ├── routes/       # Route definitions and handlers
│   │       ├── server/       # HTTP server setup and instantiation (ExpressHttpServer)
│   │       └── types.ts      # HTTP specific types
│   ├── contexts/             # Shared modules, cross-cutting concerns, and framework code
│   │   └── shared/
│   │       ├── domain/       # Shared domain logic and base classes
│   │       ├── global-context/ # Global application context/state (if any)
│   │       ├── logger/       # Logging setup and utilities (Pino)
│   │       ├── problem/      # Standardized error/problem details implementation
│   │       ├── response/     # Standardized API response structures
│   │       └── utils/        # Common utility functions
│   └── types/                # Global TypeScript type definitions and declarations
│       └── reset.d.ts        # TypeScript global type resets/enhancements
├── tests/                    # Automated tests
│   ├── features/             # Behavior-driven development (BDD) tests using Cucumber
│   │   └── health.feature
│   └── unit/                 # Unit tests for individual modules/functions
│       └── health_controller.test.ts
├── .env.example              # Example environment variable file
├── .gitignore                # Specifies intentionally untracked files that Git should ignore
├── .npmignore                # Specifies files that should be ignored when publishing to npm
├── .nvmrc                    # Node Version Manager configuration file
├── .tool-versions            # asdf version manager configuration file
├── biome.json                # Configuration for Biome.js (linter, formatter)
├── commitlint.config.ts      # Configuration for commit message linting
├── Dockerfile                # Instructions for building a Docker container for the application
├── knip.config.ts            # Configuration for Knip (dependency and unused code detection)
├── lefthook.yml              # Configuration for Lefthook (Git hooks manager)
├── LICENSE                   # Project's software license information
├── package.json              # Defines project metadata, dependencies, and scripts
├── pnpm-lock.yaml            # Exact versions of dependencies (lock file for pnpm)
├── pnpm-workspace.yaml       # PNPM workspace configuration
├── README.md                 # This file: Project overview, setup, and usage instructions
├── Taskfile.yml              # Definitions for tasks managed by Task (task runner)
├── tsconfig.json             # TypeScript compiler options and project configuration
└── vitest.config.mjs         # Configuration for Vitest (test runner)
```


## Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests on GitHub. Let’s work together to improve this boilerplate and enhance the developer experience.



## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
