# Environment

## General (all services)

| Variable      | Default-Value | Description  |
| ------------- |:-------------:| ------------|
| LOG_LEVEL | info | The logging level. Possible values: **error**, **warn**, **info**, **verbose**, **debug**, **silly** |

## WebServer

| Variable      | Default-Value | Description  |
| ------------- |:-------------:| ------------|
| CFG_SERVER_INTERFACE | 0.0.0.0 | The interface on which the server should listen |
| CFG_SERVER_PORT | 3000 | The port on which the server should be bind |
| CFG_SERVER_URL | http://localhost:3000 | The external url of the application (the browser will request this url) |
| CFG_OAUTH2_CLIENT_ID | clientId | The **initial** oauth2 client. If there is no client persisted, a new client will be stored with that id. |
| CFG_OAUTH2_CLIENT_SECRET | secret | The **initial** oauth2 client. If there is no client persisted, a new client will be stored with that secret. |
| CFG_OAUTH2_USER_NAME | admin | The **initial** oauth2 user. If there is no user persisted, a new client will be stored with that name. |
| CFG_OAUTH2_USER_PASSWORD | admin | The **initial** oauth2 user. If there is no user persisted, a new client will be stored with that password. If the password starts with "$2a$" it will assume as bcrypt-hash and will store 1:1 into the db. Otherwise a bcrypt-hash will generated from the given password and stored into the db. |
