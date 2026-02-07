# Stage 1: Build Vue app
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Cấu hình Nginx để phục vụ file tĩnh
FROM nginx:stable-alpine
# Copy file đã build từ Stage 1 sang thư mục của Nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
# Copy cấu hình Nginx tùy chỉnh (sẽ tạo ở bước sau)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]