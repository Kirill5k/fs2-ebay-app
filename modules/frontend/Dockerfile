FROM node:16.19.1-alpine as build-stage
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/build /app
COPY server.conf.template /etc/nginx/templates/server.conf.template
COPY nginx.conf /etc/nginx/nginx.conf
