# Build Stage
FROM node:24-alpine AS builder
ARG VITE_API_URL
ARG VITE_ADMIN_APP_URL
ARG VITE_CLIENT_APP_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_ADMIN_APP_URL=$VITE_ADMIN_APP_URL
ENV VITE_CLIENT_APP_URL=$VITE_CLIENT_APP_URL
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build --workspace apps/client

# Production Stage
FROM node:24-alpine
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/apps/client/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
