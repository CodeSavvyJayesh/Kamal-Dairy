# ---------- build ----------
FROM node:22-alpine AS build

WORKDIR /app

# npm ci uses the lockfile, so the image is reproducible.
COPY package*.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* at build time, so the API URL has to be present here,
# not at container start:  docker build --build-arg VITE_API_URL=https://...
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- serve ----------
FROM nginx:alpine

# SPA fallback + caching + gzip. Without this config, refreshing any route
# other than "/" returns a 404 from nginx.
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
