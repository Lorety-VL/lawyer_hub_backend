FROM node:24-slim

WORKDIR /app

RUN mkdir ./uploads

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --production

COPY . .

CMD ["sh", "-c", "node app.js"]
# CMD ["sh", "-c", "npx sequelize-cli db:seed:all --env production && node app.js"]