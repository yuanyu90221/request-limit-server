# stage 1 build the code
FROM node:10.18.0 AS builder

RUN mkdir /app

COPY  server /app

COPY package.json /app

RUN npm install

ARG NODE_ENV

ARG APP_NAME

ARG PORT

ARG REDIS_PASSWD

ARG REDIS_PORT

ARG REDIS_HOST

ENV NODE_ENV=${NODE_ENV}

ENV APP_NAME=${APP_NAME}

ENV PORT=${PORT}

ENV REDIS_PASSWD=${REDIS_PASSWD}

ENV REDIS_PORT=${REDIS_PORT}

ENV REDIS_HOST=${REDIS_HOST}

#stage 2 
FROM node:10.18.0

COPY --from=builder /app ./app

RUN chown -R node:node /app

USER node

EXPOSE ${PORT}

WORKDIR /app

CMD ["node", "server/server.js"]