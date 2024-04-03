# Use an official Node runtime as a parent image
FROM node:20

WORKDIR /usr/src/application

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
