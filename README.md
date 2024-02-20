This is project demonstrated in [FreeCodeCamp Video tutorial on NestJS with REST API](https://www.youtube.com/watch?v=GHTA143_b-s).

[NextJS official documentation](https://docs.nestjs.com/)


## What is NestJS?
- node js backend
- typescript friendly
- uses express
- solves architecture and other weak points of express js
- scalable and maintainable
- modular structure
- uses dependency injection


## Why use NestJS
- structure
- modularity
- typescript
- graphql
- microservices
- REST api
- documentation
- popularity and community


## Installation
```sh
$ npm i -g @nestjs/cli
$ nest -v
10.3.2
```


we are using yarn instead of npm in this
`$ brew install yarn`


## we are creating bookmark application

creating a new project
`$ nest new nestjs-api-fcc-tutorial

and select `yarn` as the package manager

check project structure after creating the project


delete the below-given files
- `src/app.controller.spec.ts`
- `app.controller.ts`
- `src/app.service.ts`

and remove the references from `src/app.module.js`

`app.module.js` 
- similar to app.js
- imports other modules

## [module](https://docs.nestjs.com/modules)
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


## building application

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

## Dependency Injection
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

## creating routes
```ts
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    signUp() {}

    @Post("signin")
    signIn() {}
}
```

`@Controller("auth")`  - global prefix for auth
the request would look like /auth/signup

When you check the response headers in Postman, you will see
`X-Powered-By: Express` 

## DB setup
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

you can use 
`$ prisma migrate deploy` - Apply pending migrations to the database in production/staging
 


To make a module global, you need to add `@Globla()` decorator to the module. This will add your module in `app.module.ts`




**Foreign key references**
```ts

model User {
	...
	@@map("Users") // table name in the database
	bookmarks Bookmark[] // to denote the User is referenced in Bookmark
}

model Bookmark {
	...
    userId Int // local field
    // userId is local field and id is the foreign key from User table
    user User @relation(fields: [userId], references: [id])

    @@map("bookmarks") // table name in the database
}
```

while implementing foreign key and cascade deletes, you have two way to accomplish this.
- cascade delete in model: you need to run the migration for this.
	`user User @relation(fields: [userId], references: [id], onDelete: Cascade)`
- add manually delete code in `PrismaService class`
```ts
cleanDb() {
	return this.$transaction([
		this.bookmark.deleteMany(),
		this.user.deleteMany(),
	]);
}
```


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

## [pipes](https://docs.nestjs.com/pipes)
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


## authentication
we are going to use [argon](https://www.npmjs.com/package/argon2) package for hashing the password


```ts
const hash = await argon.hash(dto.password);

const user = await this.prisma.user.create({
	data: {
		email: dto.email,
		hash,
	},
	// to select the required fields
	select: {
		id: true,
		email: true,
		createdAt: true
	}
});
```


#### writing our own scripts
in `package.json`
```json
  "scripts": {
    "db:dev:rm": "docker compose rm dev-db -s -f -v",
    "db:dev:up": "docker compose up dev-db -d",
    "prisma:dev:deploy": "prisma migrate deploy",
    "db:dev:restart": "yarn db:dev:rm && yarn db:dev:up && sleep 1 && yarn prisma:dev:deploy",
    ...
  }
```



### config module

to read the environment variable

`$ yarn add @nestjs/config`

```ts
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                },
            },
        });
    }
}
```




### Authentication using Passport

[documentation link](https://docs.nestjs.com/security/authentication)

[Passport](https://www.npmjs.com/package/passport) is a popular Node.js library for authentication
using JWT

```sh
$ yarn add @nestjs/passport passport @nestjs/jwt passport-jwt
$ yarn add -D @types/passport-jwt
```


### Strategies

NestJS provides various strategies for handling authentication, including built-in strategies and integration with external packages like Passport.js. Here are some of the authentication strategies commonly used in NestJS:

- **Local Strategy:** This strategy is commonly used for username and password authentication, where credentials are typically sent through a login form. It verifies the credentials against a local database or other authentication mechanism.

- **JWT (JSON Web Token) Strategy:** JSON Web Tokens are a popular method for implementing stateless authentication. The JWT strategy verifies the token provided by the client against a secret key or a public key to ensure its validity and extract the user information from it.

- **OAuth2 Strategy:** OAuth2 is an authentication framework commonly used for allowing third-party applications to access resources on behalf of a user. The OAuth2 strategy in NestJS allows integrating with OAuth2 providers such as Google, Facebook, or GitHub for authentication.

- **Passport Strategies:** NestJS integrates with Passport, a popular authentication middleware for Node.js applications. Passport provides a wide range of authentication strategies, including local authentication, OAuth, JWT, OpenID, and more. These strategies can be easily integrated into NestJS applications using Passport's middleware.

- **Session-Based Authentication:** This strategy involves using sessions to authenticate users. It typically involves storing a session ID in a cookie on the client side and maintaining session data on the server side.

- **Custom Strategies:** NestJS allows you to create custom authentication strategies tailored to your specific requirements. You can implement custom logic for verifying credentials, handling tokens, or integrating with third-party authentication providers.

Each of these strategies has its own use cases, advantages, and considerations. The choice of strategy depends on factors such as the nature of the application, security requirements, and integration with external systems.

We are going to use [jwt strategy](https://docs.nestjs.com/recipes/passport#implementing-passport-jwt) to pass the jwt token with subsequent requests.

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extract the token from bearer token
      ignoreExpiration: false, // ignore the expiry date - only for testing
      secretOrKey: jwtConstants.secret, // secret key from env
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```


### [Guards](https://docs.nestjs.com/guards)
Guards have a **single responsibility**. They determine whether a given request will be handled by the route handler or not, depending on certain conditions (like permissions, roles, ACLs, etc.) present at run-time.
 
We are going to use Passport AuthGuard

Using strategy and guard, we make sure that JWT token is used and only then this request will be processed. Else, you will get the 401 unauthorized error.

`src/auth/strategy/jwt.strategy.ts`
```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    "jwt", // AuthGuard protection; to receive only JWT token
) {
    ...
    validate(payload: object) {
        console.log("JwtStrategy::validate():", payload);
        return payload; // this will append payload the request
    }
}
```

`src/user/user.controller.js`
```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(
    Strategy,
    "jwt", // AuthGuard protection; to receive only JWT token
) {
	...
    validate(payload: object) {
        console.log("JwtStrategy::validate():", payload);
        return payload; // this will append payload the request
    }
}
```


#### [custom decorator](https://docs.nestjs.com/custom-decorators)

you can write your custom decorator process input params

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request: Express.Request = ctx.switchToHttp().getRequest();
        if (data) {
            return request.user[data];
        }
        return request.user;
    },
);
```

```ts
@Get("whoami")
getWhoAmI(@GetUser() user:User, @GetUser("email") email:string) {
	console.log("UserController::getWhoAmI(): ", {
		user, // you can access user details from request and it is passed by guard
		email,
	});

	return user;
}
```

you can pass some value in `data` from `getWhoAmI(@GetUser('email') user:User)`, and you can process it in the custom decorator to handle that.


### End to end testing

By default, NestJS uses `supertest` package for unit testing.
Here we use [Pactum](https://pactumjs.github.io/introduction/welcome.html) It is request making library. It needs a server to make request.
we use Jest framework for testing.

We need to setup a test db. 
`$ yarn add -D pactum` -> to add the package
`$ yarn test:e2e` -> to run the tests
it points to `"test:e2e": "jest --watch --no-cache --config ./test/jest-e2e.json"` in `package.json`

We need to add the components that we use `main.ts`, we need use them in `app.e2e-spec.ts`.

```ts
import * as pactum from "pactum";
...
describe("Auth", () => {
	describe("Signup", () => {
		it("Should signup", () => { // "Should signup" is the title of the test
			const dto: AuthDto = {
				email: "test@example.com",
				password: "test123",
			};
			return pactum
				.spec()
				.post("http://localhost:3333/auth/signup")
				.withBody(dto)
				.expectStatus(HttpStatus.CREATED)
				.inspect(); // you can get the final response recieved 
		});
	});
});
```

output:
```json
  console.warn
{
  "statusCode": 201,
  "headers": {
	"x-powered-by": "Express",
	"content-type": "application/json; charset=utf-8",
	"content-length": "193",
	"etag": "W/\"c1-DBAyozwvBFTqS/en8VLV2IBcuOk\"",
	"date": "Sun, 18 Feb 2024 19:38:45 GMT",
	"connection": "keep-alive",
	"keep-alive": "timeout=5"
  },
  "body": {
	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTcwODI4NTEyNSwiZXhwIjoxNzA4Mjg4NzI1fQ.Dzp0X3xXYsE-26plfUJ1qzR7JfKlLslV1m-Lh-ntDkw"
  }
}
```

you can set base url by
`pactum.request.setBaseUrl(`http://localhost:${PORT}`);`

You can store the values from the API response. In our case, we need to store the token from signin request.
```ts
it("Should signin", () => {
	return pactum
		.spec()
		.post("/auth/signin")
		.withBody(dto)
		.expectStatus(HttpStatus.OK)
		.stores("userAccessToken", "accessToken"); // userAccessToken is a variable that stores the token from the response
});

...

describe("Who am I", () => {
	it("Should get current user details", () => {
		return pactum
			.spec()
			.get("/users/whoami")
			.withHeaders({
				Authorization: "Bearer $S{userAccessToken}" // to use the variable from the store
			})
			.expectStatus(HttpStatus.OK)
	});
});


```


#### env for testing
To manage different environment, we are going to use `dotenv-cli` 
`$ yarn add -D dotenv-cli`

Then, we are going to create a file `.env.test` and add dotenv parameter in the `package.json` 
```json
{
	...
	"db:test:rm": "docker compose rm test-db -s -f -v",
	"db:test:up": "docker compose up test-db -d",
	"prisma:test:deploy": "dotenv -e .env.test -- prisma migrate deploy",
	"db:test:restart": "yarn db:test:rm && yarn db:test:up && sleep 1 && yarn prisma:test:deploy",
	"pretest:e2e":"yarn db:test:restart",
    "test:e2e": "dotenv -e .env.test -- jest --watch --no-cache --config ./test/jest-e2e.json"
    ...
	
}
```

And a hook to restart the db by
`"pretest:e2e":"yarn db:test:restart",`
Note :
- `pre` + the command that we are executing
- `dotenv -e .env.test` to use test environment file

to view the test db in prisma studio,
`$ npx dotenv -e .env.test -- prisma studio`

to connect to dev use `-e .env`







## Errors
#### Missing exports
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

**solution:** 
add `exports` to Module
```ts
@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
```

#### missing validate function in JWTStrategy function
```sh
[Nest] 98628  - 02/17/2024, 2:06:55 PM   ERROR [ExceptionsHandler] this.validate is not a function
TypeError: this.validate is not a function
    at JwtStrategy.callback [as _verify] (nestjs-api-fcc-tutorial/node_modules/@nestjs/passport/dist/passport/passport.strategy.js:11:55)
    at nestjs-api-fcc-tutorial/node_modules/passport-jwt/lib/strategy.js:123:34
    at nestjs-api-fcc-tutorial/node_modules/jsonwebtoken/verify.js:261:12
```

**solution**:
```ts
export class JwtStrategy extends PassportStrategy(
    Strategy,
    "jwt", // AuthGuard protection; to receive only JWT token
) {
	...
    validate(payload: object) {
        console.log(payload);
        return payload;
    }
}
```