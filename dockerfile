# Stage 1: Build
FROM node:20-bullseye-slim as build-stage
WORKDIR /app

# Nhận các biến ARG từ docker-compose để "nướng" vào JS
ARG VITE_API_BASE_URL
ARG VITE_DISCORD_CLIENT_ID
ARG VITE_DISCORD_REDIRECT_URI

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_DISCORD_CLIENT_ID=$VITE_DISCORD_CLIENT_ID
ENV VITE_DISCORD_REDIRECT_URI=$VITE_DISCORD_REDIRECT_URI

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]