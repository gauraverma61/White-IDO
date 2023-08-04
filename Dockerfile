FROM node:16.19.0-alpine3.17
RUN apk add gyp python3 make g++ git

WORKDIR /opt/app
COPY package*.json ./
COPY . /opt/app
ARG API_SERVER="https://subgraph.pariopad.com"
ARG NEXT_PUBLIC_NETWORK_ID=3
RUN yarn install
RUN yarn build
CMD [ "npm", "start" ]
