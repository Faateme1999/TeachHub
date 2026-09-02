# NestJs

- Nest is a progressive Nodejs framework (we can adopt its features gradually and expend the project overtime), it's also a batteries-included (providing many built-in libraries so we dont need to install them separately)
- Nest runs on Node.js and use TypeScript (or JavaScript) t0 build server-side applications. (which means the app runs on the server rather than in the user's browser (client-side))
- Nest is scalable (the different parts of the app are separated like logo) which helps the app handle an increasing number of useres without crashing.

## Node.js

- allows JavaScript to run on the server.

## FP & FRP

- Functional programming : it's a programming approach that wires functions together like building logo, the output of one function becomes the input of another, and each function performs a single task independently.
- Functional reactive programming: whenever data changes, the application automatically reacts to those changes!

### polling

- keep asking! Imagine yoU are waiting for postman/postwoman we have two choices: we can open the door every 5 seconds to check whether they have arrived (polling)! or we can sit and wait unti the doorbell rings, then react and get up! (reactive programming)

## Express / Fastify (http server libraray)

- Nest doesn't talk to the server directly! It uses Fastify or Express, In fact Nest is built on top of Express. (it has Express inside it)
- Express is a framework that knows how to handle requests coming from a browser (its job is to listen for requests and send responses)
- Nest organizes the code and sends the appropriate response.
- Nest => Express => Server / server => Express => Nest

## module

- A module is a class difned with the @Module decorator ,it is like a folder that keeps all related parts of a feature together. it groups related services, controllers and other modules into a single container.
- In each module, we have 3 main parts: controller, service and module (other modules that this module depends on)
- Benefits: different team members can work on different modules independently, we can find and maintain code easily, moduls are reusable, testing becomes easier.
- A module has 4 properties:
  - providers: contains services and other providers used by the module
  - controllers: handle incoming requests and return responses
    - The controller delegates the work to the service.
    - Browser => Controller => Service => Database
  - imports: lists other modules thet this module depends on
  - exports: lists providers that can be used by other modules when they import this module
- The `@Module` decorator groups related controllers + services together.
- SOC (Separation of Concerns): each pat has a specific responsibility:
  - controller: handles HTTP requests and responses
  - service: encapsulate business logic
  - module: wires everything together.

## IoC

- behind the scenes, NestJs resolves dependencies via IOC (Inversion of Control) contaier.
- Inversion of Control means that Nest controls the creation and management of objects instead of us doing it manually.
- we tell the IoC that we have a service called UserService, the container registers it,creates it when needed and performs dependency injection automatically.
- If the same service is needed in multiple places, the IoC container creates a single instance and shares it.
- In fact, Nest creats a conatiner in memory that keeps all services.
- It acts as a dependency container that stores services, controllers, repositories, and other providers. It knows what depends on what and creates everything automatically.

```ts
@Injectable()
  constructor(repo: Repository) {}
```

How it works:

1. Provider Registration: when we write providers: [UserService, UserRepository], Nest stores them in the IoC container.
2. Constructor Analysis and discovers dependencies: For example, if UserService needs UserRepository, Nest creates a dependency tree.
3. Nest craetes them from the bottom up! first UserRepository, then UserService.
4. Dependency Injection: behind the scenes, Nest does something like this:
   new UserService(new UserRepository()) and injects the dependency automatically.

## Constructor

- Is a function that runs automatically when an object is created from a class,its job is to prepare and initialize that object!
- when we inject a service, the IoC container is involved.
- constructor(parameter1: Type1 (everything that this class needs them while creating)) { // code that runs}
- when we inject a service inside a constructo, Nest undrestands it and takes an instance of that service from the IoC, then provides it to the class automatically.

## Decortors and MetaData

- ‍‍‍`@` tells Nest what a class is.
- Metadata is extra information about the class attached to a class or method.
- Nest reads this metadata at runtime to wire everything together
- `@Module , @Controller, @Injectable` (this class can be injected)
- decorator : @Music , metadata: singer, yearPublished

```ts
@Controller(metadata)
@Controller('users')
class UserController {}
```

Here:

@Controller('users') is a decorator
'users' is metadata

- Nest stores this information and understands that this class handles routes that start with /users.

```ts
@Injectable()

```

- This is a decorator.
- It tells Nest: "This class can be managed by Nest's Dependency Injection system."
  - Without it, Nest wouldn't know that it should create an instance of UsersService and inject it into other classes (like our controller).

## HTTP Server with hot reloading

- Nest provides an HTTP server for us, without shutting it down, when we change a line of code, Nest detects the change and reload the updated code automatically, we can immediately see the result.
- Strict typing is supported.
- Sensible folder layout: Nest provides a built-in project structure.

## Jest

- دest has built-in support for Jest. which is a testing framework.

## Loose Coupling

- different parts of an application are not tightly dependent on each other.
- Thanks to dependency injection, when we need a service inside another service or a controller, we do not manually create instances using new. Instead, we simply inject the dependency.
- As a result, services and controllers are loosely connected, which means changes in one part of the application have minimal impact on others.

# Entity

- An entity is simply something important enough to have its own data and identity in the database.
- A user has: id, name, email, password. Since a user has its own information, it deserves its own table or Enrollment : id, studentId, courseId, createdAt
- This table answers questions like:
  - Which students are enrolled in this course?
  - Which courses does Alice own?
  - When did she enroll?
- This is called a relationship table (also known as a join table) because it connects two entities: User and Course.

# nest g resource users

- creating a new feature that needs everything: routes, business logic, DTOs, etc.

## resource

- A resource is a complete feature in your application.
  - For example: Users, Courses, Lessons, Enrollments, Auth

# DTO

- Data Transfer Object
- Imagine your frontend wants to register a user.
- It sends this:

```ts
{
  "name": "Ali",
  "email": "ali@gmail.com",
  "password": "123456"
}
```

- How does Nest know what data it should expect?
- This class tells it.

```ts
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}
```

- When creating a user, I expect these three fields. (Think of it as a contract)
- DTOs help define and control the shape of incoming data.
- we separate DTOs based on what the client is trying to do.

# @Body()

- Imagine the client sends:

```ts
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "123456"
}
```

- Nest automatically does this for you:

```ts
const createUserDto = {
  name: 'John',
  email: 'john@gmail.com',
  password: '123456',
};
```

- You don't need to manually read the request body. That's what @Body() does.

# JWT

- Used for login tokens

# Passport

- Authentication framework Nest integrates with

# bcrypt

- Used to hash passwords (VERY important)

- Rule: Request URL → Matching Controller → Service → Database

- For a request like: POST /auth/register
  - Request → AuthController → AuthService → UserService → PrismaService → Database

- DTO = request data (What information is the client allowed to send?)
- Data = database-ready data

- JWT : JSON Web Token
  - After login, the server must remember who the user is.
  - Login → Server verifies email/password → Creates a token → Sends token to client → Client sends token with future requests → Server knows who the user is
  - payload + secret key → JWT token

- payload + secret → signature
- When the token comes back: token + secret → recalculate signature → Does it match the token's signature?

- Client Request → DTO → Service → Data Type → Prisma → Schema Model → Database
  - Schema Model: How the User table looks in the database. (Database Blueprint/shape)
  - DTO: This is for incoming requests (data coming FROM the client/ Request shape)
  - Data Type = data passed BETWEEN services (Internal shape/ hashed password)

- MVP (minimum viable product)
- Schema changed → Prisma Client must be regenerated (That's why migrate dev automatically runs generate.)

- Reflector is a NestJS utility that reads metadata added by decorators like @Roles().
  - It doesn't know anything about users, JWTs, or admins. It simply answers questions like:
  - "What roles are required for this route?"

- Controller
  ↓
  Service
  ↓
  Repository
  ↓
  PrismaService
  ↓
  PostgreSQL
  ↓
  Tables
