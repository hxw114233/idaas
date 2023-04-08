FROM node:18-alpine

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

ENV PORT=3000
ENV HOST=localhost:3000
ENV TZ=${TZ}

ENTRYPOINT [ "yarn", "start" ]
