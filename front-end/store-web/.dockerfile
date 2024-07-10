##  SET MODE "standalone"
##  More infor: "https://nextjs.org/docs/advanced-features/output-file-tracing"

# Build BASE
FROM node:20-alpine as BASE
LABEL author="hoangdq"

WORKDIR /app
COPY package.json yarn.lock ./
RUN apk add --no-cache git \
    && yarn --frozen-lockfile \
    && yarn cache clean


# Build Image
FROM node:20-alpine AS BUILD
LABEL author="hoangdq"

WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && yarn build \
    && cd .next/standalone \
    && node-prune

# Build production
FROM node:20-alpine AS PRODUCTION
LABEL author="hoangdq"

WORKDIR /app

COPY --from=BUILD /app/yarn.lock ./
COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.js ./

# Copy .env.production file into the image
COPY .env.production .env

# Set mode "standalone" in file "next.config.js"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
# CMD yarn dev