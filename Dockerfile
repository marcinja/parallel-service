FROM node:16
WORKDIR /usr/app

COPY package*.json ./
COPY tsconfig.json ./
# RUN npm install -g yarn
RUN yarn install
RUN yarn build
COPY ./dist .

EXPOSE 4321

CMD ["yarn", "start"]