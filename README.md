## EFS Challenge

### Setup

You'll need Docker to run this project. First spin up the Docker daemon. Then

```
// Install dependencies
npm i

// Add execution rights to startup scripts
chmod +x bin

// Run app locally
npm run start:dev

// Run E2E tests
npm run test:e2e

// Run app from Docker container
npm run start
```

After that, you can interact with the API via Postman or through Swagger via

```
http://localhost:3000/api
```

### Explanation

This project is built using NestJS framework, which is connected to a Postgres DB via Prisma ORM.

When run using `npm run start:dev` or `npm run test:e2e`, only the Postgres DB is spun up in a Docker container, but when run using `npm run start`, both the NestJS app and the DB are run through connected containers. This was made in order to facilitate development and have the possibility of have the app watch changes in dev mode.

On startup, I used Prisma Client to create the new table based on the schema and then fill the DB through the provided JSON seed. It already filters repeated values on startup, and then corresponding logic was added in the endpoints in order to allow filtering on the results and avoid duplicated entries.

Refer to Swagger by hitting `http://localhost:3000/api` to see more information on the API and test the endpoints.