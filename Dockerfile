FROM node:24-slim

WORKDIR /app

RUN mkdir ./uploads

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --production

COPY . .

CMD ["node", "app.js"]