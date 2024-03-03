FROM node:21.6.2-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8082

CMD ["yarn", "start"]
