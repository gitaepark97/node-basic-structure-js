FROM node:14

WORKDIR /app/socket

COPY package.json .

RUN npm install -g pm2
RUN npm install --production

COPY . .