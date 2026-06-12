FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY server/package.json ./server/
COPY packages/shared/package.json ./packages/shared/

# Reorganized infra files are now within server/src/
COPY . .

RUN npm install

# Build server assuming infrastructure is now internally referenced
RUN npm run build:server

EXPOSE 5000

CMD ["npm", "run", "start:server"]