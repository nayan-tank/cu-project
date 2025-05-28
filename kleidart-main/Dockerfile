# ---------------------------
# Stage 1: Build React Frontend
# ---------------------------
FROM node:18-alpine as frontend-build

WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# ---------------------------
# Stage 2: Build Node.js Backend
# ---------------------------
FROM node:18-alpine as backend-build

WORKDIR /app/server

COPY server/package*.json ./
RUN npm install

COPY server/ ./

# Copy built frontend from Stage 1 to backend's public folder
COPY --from=frontend-build /app/client/build ./public

# ---------------------------
# Final Stage: Production Image
# ---------------------------
FROM node:18-alpine

WORKDIR /app

COPY --from=backend-build /app/server /app

EXPOSE 5000

CMD ["node", "server.js"]
