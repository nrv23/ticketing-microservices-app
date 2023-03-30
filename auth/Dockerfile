FROM node:14-alpine

WORKDIR /app
COPY package.json /app
RUN npm install --only=prod
COPY . /app

CMD ["npm","start"]
# investigar para nodejs 16 la forma de instalar dependencias solo de produccion