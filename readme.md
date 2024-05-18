docker build -t auth-service:dev -f docker/dev/Dockerfile .

docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5501:5501 -e NODE_ENV=development auth-service:dev

docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v merngpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres
