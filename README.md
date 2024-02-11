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