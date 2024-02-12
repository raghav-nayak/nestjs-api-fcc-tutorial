This is project demonstrated in [FreeCodeCamp Video tutorial on NestJS with REST API](https://www.youtube.com/watch?v=GHTA143_b-s).

[NextJS official documentation](https://docs.nestjs.com/)


What is NestJS?
- node js backend
- typescript friendly
- uses express
- solves architecture and other weak points of express js
- scalable and maintainable
- modular structure
- uses dependency injection


why use NestJS
- structure
- modularity
- typescript
- graphql
- microservices
- REST api
- documentation
- popularity and community


installation
```sh
$ npm i -g @nestjs/cli
$ nest -v
10.3.2
```


we are using yarn instead of npm in this
`$ brew install yarn`


creating a new project
`$ nest new nestjs-api-fcc-tutorial

and select `yarn` as the package manager

See the project structure after creating the project

delete the below-given files
- `src/app.controller.spec.ts`
- `app.controller.ts`
- `src/app.service.ts`

and remove the references from `src/app.module.js`

`app.module.js` 
- similar to app.js
- imports other modules

### [module](https://docs.nestjs.com/modules)
- a class annotated with a `@Module()` decorator. 
- The `@Module()` decorator provides metadata that **Nest** makes use of to organize the application structure.
- each application has at least one module viz. a root module.
- the root module is used to build the application graph
	- the internal data structure Nest uses to resolve 
		- modules
		- provider relationships
		- dependencies
- `@Module()` takes a single object with properties
	- providers
		- instantiated by the Nest injector
		- may be shared at least across this module
	- controllers
	- imports
	- exports


### building application

default port is 3000.

To run application, `$yarn start:dev`
it creates `dist` folder at the root level for js files.

**creating a new module**
```sh
$ nest g module user
CREATE src/user/user.module.ts (81 bytes)
UPDATE src/app.module.ts (216 bytes)
```
where g - generate
This 
- creates a folder inside `src` folder with name `user`
- creates a file called `user.module.ts` inside `src/user`  
- updates `imports` inside `app.module.ts`

annotation for controller class - `@Controller()`
annotation for service class - `@Injectable`

Controllers receive request and call service do a task.

#### Dependency Injection
```ts
@Controller()
export class AuthController {
    constructor(private authService: AuthService) {
    }
}
```

this is equivalent to
```ts
@Controller()
export class AuthController {
	authService: AuthService
    constructor(authService: AuthService) {
	    this.authService = authService
    }
 }
```

### creating routes
```ts
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    signUp() {}

    @Post("login")
    login(){}
}
```

`@Controller("auth")`  - global prefix for auth
the request would look like /auth/signup

When you check the response headers in Postman, you will see
`X-Powered-By: Express` 


### DB setup
using docker with postgres. 
Create a docker-compose file for db setup.

Run below command 
`docker compose up dev-db -d` 
`docker ps`
`docker logs <postgres container id>`

ORM is [Prisma](https://www.prisma.io/)

add package by running
`$ yarn add -D prisma`   -D stands for developer dependency
`$ yarn add @prisma/client`  
`$ npx prisma init` -  Set up a new Prisma project
	- creates .env file at root level with connection string
	- creates `prisma` folder at root level with file `schema.prisma` for models

once you add models in `prisma/schema.prisma`, run the below command
`$ npx prisma migrate dev`
and provide some name to this migration .. e.g. init
It will create `migrations` folder within `prisma` directory 
```sh
$ npx prisma migrate dev
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "nest", schema "public" at "localhost:5432"

✔ Enter a name for the new migration: … init
Applying migration `20240211184456_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20240211184456_init/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.9.1) to ./node_modules/@prisma/client in 162ms
```

generate ts models
```sh
$ npx prisma generate
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (v5.9.1) to ./node_modules/@prisma/client in 137ms

Start using Prisma Client in Node.js (See: https://pris.ly/d/client)

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

or start using Prisma Client at the edge (See: https://pris.ly/d/accelerate)

import { PrismaClient } from '@prisma/client/edge'
const prisma = new PrismaClient()

See other ways of importing Prisma Client: http://pris.ly/d/importing-client

┌─────────────────────────────────────────────────────────────┐
│  Deploying your app to serverless or edge functions?        │
│  Try Prisma Accelerate for connection pooling and caching.  │
│  https://pris.ly/cli/accelerate                             │
└─────────────────────────────────────────────────────────────┘
```


Once you run the generate command, you can use 
`import { User, Bookmark } from "@prisma/client";`

UI for viewing tables
`$ npx prisma studio`


create a new module with name `prisma`
```sh
$ nest g module prisma
CREATE src/prisma/prisma.module.ts (83 bytes)
UPDATE src/app.module.ts (362 bytes)
```


create a service with name `prisma` without test file
```sh
$ nest g service prisma --no-spec
CREATE src/prisma/prisma.service.ts (90 bytes)
UPDATE src/prisma/prisma.module.ts (163 bytes)
```

After this, you see a folder `src/prisma` with module and service files.


To make a module global, you need to add `@Globla()` decorator to the module. This will add your module in `app.module.ts`


**Note:** You can access express module function from nest.
e.g.
```ts
import { Request } from "express";

...

    @Post("signup")
    signUp(@Req() req: Request) {
        console.log(req.body);
        return this.authService.signUp();
    }
```

NestJS comes with inbuilt validation.

DTO(Data Transfer Object)

### [pipes](https://docs.nestjs.com/pipes)
- a class annotated with the `@Injectable()` decorator, which implements the `PipeTransform` interface.
- has two typical use cases:
	- **transformation**: transform input data to the desired form (e.g., from string to integer)
	- **validation**: evaluate input data and if valid, simply pass it through unchanged; otherwise, throw an exception
- Built-in pipes: Nest comes with nine pipes available out-of-the-box:
	- `ValidationPipe`
	- `ParseIntPipe`
	- `ParseFloatPipe`
	- `ParseBoolPipe`
	- `ParseArrayPipe`
	- `ParseUUIDPipe`
	- `ParseEnumPipe`
	- `DefaultValuePipe`
	- `ParseFilePipe`
- we are going to use `class-validator` and `class-transformer`
	`$ yarn add class-validator class-transformer`

To user pipes, you need to add below lines in `main.ts`
```ts
import { ValidationPipe } from '@nestjs/common';
...
app.useGlobalPipes(new ValidationPipe());
```

you can also pass `whitelist:true` to the ValidationPipe to remove unwanted fields from the input. The controller will get only relevant fields only.
`app.useGlobalPipes(new ValidationPipe({ whitelist: true }));`


### authentication
we are going to use [argon](https://www.npmjs.com/package/argon2) package for hashing the password









### Errors
1. Missing exports
```sh
[Nest] 90751  - 02/12/2024, 9:12:39 PM   ERROR [ExceptionHandler] Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument PrismaService at index [0] is available in the AuthModule context.

Potential solutions:
- Is AuthModule a valid NestJS module?
- If PrismaService is a provider, is it part of the current AuthModule?
- If PrismaService is exported from a separate @Module, is that module imported within AuthModule?
  @Module({
    imports: [ /* the Module containing PrismaService */ ]
  })

Error: Nest can't resolve dependencies of the AuthService (?). Please make sure that the argument PrismaService at index [0] is available in the AuthModule context.
```
solution: add `exports` to Module
```ts
@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
```
