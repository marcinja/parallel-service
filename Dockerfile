FROM node:14.17.0
ARG BUILD_CONTEXT

WORKDIR /base
# COPY package.json tsconfig.json ./
# COPY yarn.lock .
# COPY ./packages/${BUILD_CONTEXT}/package.json packages/${BUILD_CONTEXT}
# COPY ./packages/scripts packages/scripts
# RUN yarn install
# COPY ./packages/${BUILD_CONTEXT} packages/${BUILD_CONTEXT}
# COPY ./packages/lib packages/lib
COPY . .
RUN yarn install

RUN yarn build
# COPY ./packages/${BUILD_CONTEXT}/dist packages/${BUILD_CONTEXT}/

EXPOSE 4321
CMD ["node", "packages/app/dist/src/index.js"]