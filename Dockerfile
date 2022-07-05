FROM node:16

# Declare that we are running in production mode to reduce dependencies
ENV NODE_ENV=production

# Copy Web + all deps
ADD Base /app/Base
ADD Plugins /app/Plugins
ADD Web /app/Web

# Install everything, following the required dependency chain
WORKDIR /app/Plugins
RUN npm install
WORKDIR /app/Base
RUN npm install
WORKDIR /app/Web
RUN npm install

EXPOSE 3000

CMD ["node", "dist/index.js"];
