FROM node:8.12-alpine as base

RUN apk update && \
    apk upgrade && \
    apk --no-cache add git

FROM base as build

WORKDIR /workspace

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY ./ ./

RUN yarn run prod:build

FROM base as release

WORKDIR /workspace
COPY --from=build /workspace/package.json ./
COPY --from=build /workspace/yarn.lock ./
RUN yarn install --production=true

COPY --from=build /workspace/public ./public
COPY --from=build /workspace/build ./build
COPY --from=build /workspace/config ./config


EXPOSE 3010
ENTRYPOINT [ "yarn", "run", "prod:run" ]
