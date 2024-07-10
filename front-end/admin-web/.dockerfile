FROM node:20-alpine 
LABEL author="hoangdq"

# Install dependencies
RUN apk add --no-cache git curl

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Install node-prune
RUN wget https://gobinaries.com/tj/node-prune 

RUN sh node-prune

RUN node-prune

COPY . .
COPY .env.production .env
EXPOSE 4000
RUN yarn build
ENV NODE_ENV=production
CMD ["yarn", "start"]
