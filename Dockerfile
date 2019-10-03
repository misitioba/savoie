FROM node:10.16.3-alpine

RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
    npm install --quiet node-gyp -g

WORKDIR /tmp
COPY package.json .
RUN mkdir /node_modules && npm install --quiet
RUN npm config set unsafe-perm true
WORKDIR /app
COPY . /app
#ENTRYPOINT ls -n /tmp/node_modules node_modules && node src/server.js