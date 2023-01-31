FROM node:18

WORKDIR /app

# dependencies
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

WORKDIR dist

CMD ["node", "index.js"]


