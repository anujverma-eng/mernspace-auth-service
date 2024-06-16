docker build -t auth-service:dev -f docker/dev/Dockerfile .

docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env.development -p 5501:5501 -e NODE_ENV=development auth-service:dev

# DB - Postgres

docker run --rm --name mern-auth-service-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mern_auth_service_data:/var/lib/postgresql/data -p 5432:5432 -d postgres

# Test

docker build -t auth-service:test -f docker/dev/Dockerfile .

docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env.test -p 5501:5501 -e NODE_ENV=development auth-service:test

## Listens || Connect Express app in docker with Postgres DB in Docker:

The ECONNREFUSED 127.0.0.1:5432 error occurs because your Express app running in one Docker container cannot reach the PostgreSQL database running in another container using localhost. In Docker, localhost refers to the container itself, not the host or other containers.

docker network create my-network

docker run --rm --name mern-auth-service-container --network my-network -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mern_auth_service_data:/var/lib/postgresql/data -p 5432:5432 -d postgres

docker run --rm -it --network my-network -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env.test -p 5501:5501 -e NODE_ENV=development auth-service:test
