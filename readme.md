#SAVOIE TECH COOP WEBSITE

Official project for https://savoie.misitioba.com

### LOCAL DEVELOPMENT

#### Without Docker

yarn
yarn dev

#### Docker

docker-compose -f dev.yaml up
docker-compose -f dev.yaml up --build
docker-compose -f dev.yaml down
docker-compose -f dev.yaml logs -f
docker-compose -f dev.yaml restart

#### Enviromental variables

- We use a file called .env to set variables, you can create it if doesn't exist. Use env-example as example.

### DEPLOYMENT

We use Docker for deployments.
Once in the server, clone the repository, configure your .env file and compile using docker compose. Deploy as follow:

    docker-compose up -d --build


### CDN Cache

Each script from http* will be cached by the server unless you disable cache programatically. Remember, some scripts will fail to cache, such as Google Analytics. Disable cache as follow:
    
    <script cache="0" src="">