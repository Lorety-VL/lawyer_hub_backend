FROM node:24-slim

WORKDIR /app

RUN mkdir ./uploads

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --production

COPY . .

# CMD ["sh", "-c", "node app.js"]
# CMD ["sh", "-c", "npx sequelize-cli db:migrate && node app.js"]
CMD ["sh", "-c", "npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate && node app.js"]