FROM node:10.15.3-alpine

WORKDIR /app/server
ADD . .

RUN apk --no-cache add --virtual .build build-base python && \
  yarn install --production=false && \
  npm rebuild bcrypt --build-from-source && \
  yarn cache clean && \
  apk del .build

EXPOSE 3000

CMD [ "yarn", "start" ]
