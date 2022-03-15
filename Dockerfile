FROM node:14.17.0
WORKDIR /app

COPY package.json yarn.lock ./
COPY tsconfig.json ./
RUN yarn install
RUN yarn build
COPY ./dist .

EXPOSE 4321

CMD ["node", "src/index.js"]