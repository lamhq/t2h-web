FROM node:12.18.3-alpine as builder

ENV NODE_ENV build

RUN apk add --no-cache make gcc g++ python

USER node
WORKDIR /home/node

# Copy package.json in advance for caching
COPY package*.json /home/node/
RUN npm ci

COPY . /home/node
RUN npm run build

# ---

FROM node:12.18.3-alpine

ENV NODE_ENV production

USER node
WORKDIR /home/node

# Copy package.json in advance for caching
COPY --from=builder /home/node/package*.json /home/node/
RUN npm ci --production --silent

COPY --from=builder /home/node/server/ /home/node/server/
COPY --from=builder /home/node/public/ /home/node/public/
COPY --from=builder /home/node/.next/ /home/node/.next/
COPY --from=builder /home/node/next.config.runtime.js /home/node/next.config.js

EXPOSE 3000

CMD ["npm", "start"]
