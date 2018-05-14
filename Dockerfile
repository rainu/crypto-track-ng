FROM node:alpine
MAINTAINER rainu <rainu@raysha.de>

ENV NODE_ENV "production"

COPY .nuxt/dist /application/.nuxt/dist
COPY common /application/common
COPY ./server/backend /application/server/backend
COPY package.json /application/package.json
COPY nuxt.config.js /application/nuxt.config.js

WORKDIR /application/

RUN apk --update --no-cache add git python make g++ &&\
    npm install &&\
    apk del git python make g++

CMD [ "node", "server/backend/app.js" ]
