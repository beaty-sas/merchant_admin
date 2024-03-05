FROM node:21.6.2-alpine

WORKDIR /app

# Установка переменных окружения
ENV NEXT_PUBLIC_AUTH0_CLIENT_ID=j96fFbnX4KcqQm5fX0eHc69guhBekcsG
ENV NEXT_PUBLIC_AUTH0_DOMAIN=reserve-exp.eu.auth0.com
ENV NEXT_PUBLIC_AUTH0_AUDIENCE=https://reserve-exp.eu.auth0.com/api/v2/
ENV NEXT_PUBLIC_AUTH0_SCOPE="openid profile email"
ENV NEXT_PUBLIC_AUTH0_CALLBACK_URL=http://localhost:8082/auth/auth0/callback
ENV NEXT_PUBLIC_HOST_API=https://api.reserve.expert

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8082

CMD ["yarn", "start"]

