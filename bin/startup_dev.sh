trap 'bin/shutdown.sh' EXIT

docker compose -f docker-compose.dev.yml up -d
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
nest start --watch