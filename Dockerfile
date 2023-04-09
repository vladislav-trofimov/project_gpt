FROM node:18.12.1-alpine3.15 AS builder

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN npm prune --production \
    && npm install --production

RUN rm -rf src

FROM node:18.12.1-alpine3.15

RUN rm -rf /usr/local/lib/node_modules/npm/ /usr/local/bin/npm

WORKDIR /app

COPY --from=builder /app .

EXPOSE 1089 2089

ENTRYPOINT ["node", "-r", "dotenv/config", "./dist/server.js", "dotenv_config_path=/run/secrets/environment"]
