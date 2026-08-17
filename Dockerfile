FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install @rolldown/binding-linux-x64-gnu
RUN npm install lightningcss-linux-x64-gnu

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]