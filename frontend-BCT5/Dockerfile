# Stage 1: Build the app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Serve the app with `serve`
FROM node:20-alpine

WORKDIR /app

# Install a lightweight static file server
RUN npm install -g serve

# Copy only the built files from the builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
