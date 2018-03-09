# crypto-track-ng

Track all crypto currencies and show the composition of your portfolio. In additional it generates
a "tax-report". This is a list of tax-related trades (with the FIFO-Method)

# Progress

**ALPHA**


## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

# Config

Each configuration can set over the environment variables. For example: if we want to set
the **server.port**, we have to define a environment variable named **CFG_SERVER_PORT**. So the
environment variable starts with **CFG_** followed by the "config_path". Where the config path
is UPPER-Case and each dot (.) have to be replaced with underscore (_).

# building process

This repository contains the whole project inclusive the server and services such like the 
course-crawler. Maybe this is not the best-practice. But for the moment i don't know it better :)
For that reason i created a own webpack-config for each sub-module. This webpack-config is
responsible for packing and compress the node-application in its own *dist*-directory. 

This dist-directory will be used as content of the docker-images. In these docker-images a node-js
application is running. The docker images should be small as possible. But webpack can not pack
all node-modules in one single js-file! For that reason each docker-image contains a *package.json*.
And all packages in that *package.json* will be downloaded and *saved in* the docker image.

The docker image should be small, so we can not use the "main" *package.json* of this project. Otherwise
the docker images will contain node-packages that is not needed by the current sub-service. Therefore
i wrote the [minify-package-json.js](./minify-package-json.js). This script will have a look to the 
package.json, look for dependencies which is not used and filter them out. 


## Mini-doc

* **/common/** - common js files
* **/config/** - default config-file locations
* **/server/** - WebServer and client sources (nuxt.js app)
* **/services/** - additional services which is used for the whole application


License
-------

This project is distributed under the [MIT-License](http://www.opensource.org/licenses/mit-license.php).
