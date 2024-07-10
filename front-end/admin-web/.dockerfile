# Stage 1: Build the React application
FROM node:20-alpine AS BUILD
LABEL author="hoangdq"

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build
