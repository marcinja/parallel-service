FROM node:14.17.0

WORKDIR /app
COPY package.json yarn.lock ./
COPY tsconfig.json ./

RUN yarn install

COPY . .

EXPOSE 4321
CMD ["yarn", "start"]