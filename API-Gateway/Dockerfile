FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Expose port 3004
EXPOSE 3004

CMD ["node", "app.js"]