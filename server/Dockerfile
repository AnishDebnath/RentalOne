FROM node:24-alpine

WORKDIR /app

# 1. Copy root workspace manifest
COPY package*.json ./

# 2. Copy all workspace package.json files so npm install can resolve workspaces
COPY server/package.json ./server/
COPY packages/shared/package.json ./packages/shared/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY apps/admin/package.json ./apps/admin/
COPY apps/client/package.json ./apps/client/
COPY apps/web/package.json ./apps/web/

# 3. Copy internal server-local package.json files (file:./src/storage, file:./src/db)
COPY server/src/storage/package.json ./server/src/storage/
COPY server/src/db/package.json ./server/src/db/

# 4. Install all dependencies (include optional deps for sharp native binaries)
RUN npm install --include=optional

# 5. Copy the rest of the source code
COPY . .

# 6. Build the server
RUN npm run build:server

EXPOSE 5000

CMD ["npm", "run", "start:server"]