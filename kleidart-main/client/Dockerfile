# Build stage
FROM node as build

WORKDIR /app

# Copy source files
COPY ./public ./public
COPY ./src ./src
COPY package.json . 

# Install dependencies
RUN npm install

# Set entrypoint and expose port
EXPOSE 5173

CMD ["npm", "run", "dev"]
