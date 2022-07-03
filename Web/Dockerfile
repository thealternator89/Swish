FROM node:16

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY swish-base-*.tgz .
COPY swish-plugins-*.tgz .

RUN npm install

COPY dist ./

EXPOSE 3000

CMD ["node", "index.js"];
