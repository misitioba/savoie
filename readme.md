# Savoie Tech Coop

Fullstack web application framework.

## Development

    ```js
    yarn
    yarn dev
    ```

## Production

Once in the server, clone the repository, configure your .env file and compile using docker compose. Deploy as follow:

    docker-compose up -d --build

## Enviromental variables

- We use a file called .env to set variables, you can create it if doesn't exist. Use env-example as example.

## CDN Cache

Each script from http* will be cached by the server unless you disable cache programatically. Remember, some scripts will fail to cache, such as Google Analytics. Disable cache as follow:

    ```js
    <script cache="0" src="">
    ```

## Who uses this

https://savoie.misitioba.com 

## Credits

https://misitioba.com
