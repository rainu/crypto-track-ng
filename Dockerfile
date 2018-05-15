FROM node:alpine
MAINTAINER rainu <rainu@raysha.de>

ENV NODE_ENV "production"

COPY entrypoint.sh /application/entrypoint.sh
COPY package.json /application/package.json
COPY nuxt.config.js /application/nuxt.config.js
COPY common /application/common
COPY server /application/server

WORKDIR /application/

RUN apk --update --no-cache add git python make g++ &&\
    npm install &&\
    apk del git python make g++

CMD [ "/application/entrypoint.sh" ]
