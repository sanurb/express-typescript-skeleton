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

Welcome to the **Ultimate Express TypeScript Boilerplate**. This template equips you with a lightning-fast, production-ready server foundation by replacing Express with the superior [Ultimate Express](https://github.com/dimdenGD/ultimate-express). With the advantages of SWC transpilation, modern TypeScript configuration, and a focus on developer efficiency, you can scale up projects quickly and reliably.

## Motivation

This boilerplate is designed to help you:

- **Accelerate Setup:** Reduce the initial project setup time with a ready-to-go configuration.
- **Enhance Performance:** Replace Express with Ultimate Express for optimized routing and performance.
- **Ensure Consistency:** Leverage modern tools like SWC, Biome, Vitest, and Docker for a consistent development experience.
- **Support Modern Workflows:** Adopt TypeScript best practices and leverage a modular, scalable folder structure.

## Features

- Ultimate Express Integration: Full API compatibility with Express, with significant performance benefits.
- TypeScript-First Approach: Strict type checking and modern project configuration.
- SWC Transpilation: Lightning-fast builds powered by SWC.
- Efficient Testing: Uses Vitest with Supertest for fast and reliable testing.
- Modern Tooling: Biome for linting/formatting, concurrently for process management, and robust Docker integration.
- Stable Node Environment: Latest LTS Node version in .nvmrc
- Optimized Folder Structure: Clear separation of assets, source code, tests, and build outputs for maintainability.
- Comprehensive Testing: Setup with Vitest and Supertest
- Unified Code Style: Biomejs for consistent coding standards
- Docker Support: Ready for containerization and deployment


## Getting Started

### Quick Clone with tiged/degit

For a fast, lightweight clone of this repository, we recommend using [tiged](https://github.com/tiged/tiged) (or the alias degit). Instead of using `git clone` and downloading the entire commit history, run the following command:

```bash
tiged sanurb/ultimate-express-typescript my-app
```

This command downloads the latest commit snapshot into the folder `my-app`, resulting in a much quicker setup.

### Installation

After cloning, navigate to your project directory and install dependencies using [pnpm](https://pnpm.io/):

```bash
cd my-app
pnpm i
```


## Usage

### Development Mode

Start the development server with live recompilation and auto-reloading:

```bash
pnpm dev
```

This command runs two processes concurrently:
- **watch:compile:** Monitors your TypeScript files using SWC and outputs them into the `dist/` folder.
- **watch:dev:** Launches your server in Node’s watch mode, reloading upon changes.

### Build & Production

For a production-ready build, run:

```bash
pnpm build
```

This cleans the previous build and transpiles your code into the `dist/` directory. To run in production:

```bash
NODE_ENV=production pnpm build && node dist/src/server.js
```

### Testing

Execute your tests with Vitest:

```bash
pnpm test
```

For code coverage, run:

```bash
pnpm test:cov
```

### Linting & Formatting

Keep your code clean and uniform by running:

```bash
pnpm lint       # to check for issues
pnpm lint:fix   # to automatically fix issues
pnpm format     # to format your codebase using Biome
```



## Project Structure

Below is an overview of the project’s folder structure:

```
ultimate-express-typescript/
├── assets/                    # Static assets, images, etc.
├── dist/                      # Compiled output (generated by build/watch)
│   └── src/
│       ├── app.js
│       ├── controllers/
│       │   └── health_controller.js
│       ├── routes/
│       │   └── health.route.js
│       └── server.js
├── src/                       # Source code (TypeScript)
│   ├── app.ts
│   ├── controllers/
│   │   └── health_controller.ts
│   ├── routes/
│   │   ├── health.route.ts
│   │   └── index.ts
│   ├── server.ts
│   └── types/
│       └── reset.d.ts
├── tests/                     # End-to-end and integration tests
├── Dockerfile                 # Dockerfile for containerization
├── biome.json
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```


## Contributing

Contributions are welcome!
Feel free to open issues or submit pull requests on GitHub. Let’s work together to improve this boilerplate and enhance the developer experience.



## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.
