FROM node:20-alpine 
LABEL author="hoangdq"

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
COPY .env.production .env
EXPOSE 4000
RUN yarn build
CMD ["yarn", "start"]
