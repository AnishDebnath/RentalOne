# Build Stage
FROM node:22-alpine AS builder
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
COPY package*.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages ./packages
COPY server/package.json ./server/
RUN npm ci
COPY . .
RUN npm run build --workspace apps/admin

# Production Stage
FROM node:22-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/apps/admin/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
