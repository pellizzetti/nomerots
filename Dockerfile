FROM node:16-alpine AS build
WORKDIR /var/app
COPY . .
RUN yarn install --production=false --frozen-lockfile && \
    yarn build

FROM node:16-alpine AS dependencies
WORKDIR /var/app
COPY package.json yarn.* ./
RUN yarn install --production=true --frozen-lockfile

FROM node:16-alpine AS runtime
ARG VERSION="1.0.0"
ENV VERSION $VERSION
ENV NODE_ENV production
RUN apk add dumb-init
USER node
COPY --chown=node:node --from=dependencies /var/app/node_modules /home/node/app/node_modules/
COPY --chown=node:node --from=build /var/app/dist /home/node/app/dist/
CMD ["dumb-init", "node", "/home/node/app/dist/server.js"]