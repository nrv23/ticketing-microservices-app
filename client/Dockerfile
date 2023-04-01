FROM node:16-alpine

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

CMD ["npm","run","dev"]
# investigar para nodejs 16 la forma de instalar dependencias solo de produccion