# Build Stage
FROM node:22-alpine AS builder
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package*.json ./
COPY apps/client/package.json ./apps/client/
RUN npm install
COPY . .
RUN npm run build --workspace apps/client

# Production Stage
FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/apps/client/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
