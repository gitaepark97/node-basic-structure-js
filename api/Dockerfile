FROM node:14

WORKDIR /app/api

COPY package.json .

RUN npm install -g pm2
RUN npm install --production

COPY . .