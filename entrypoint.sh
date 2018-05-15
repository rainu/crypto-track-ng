#!/bin/sh

#if the container is created the first time...
if ! [[ -d "/application/.nuxt" ]]; then
  #...we have to build the nuxt-application
  echo "Build application"
  npm run build
fi

echo "Start application"
#now we can start the application itself
node server/backend/app.js $@
