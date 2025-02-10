FROM node:18 as builder
WORKDIR /app
COPY package.json .
COPY .env.prod .env.prod
RUN yarn install
COPY . .
RUN yarn run build

FROM nginx:mainline-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]