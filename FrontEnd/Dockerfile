# Build stage
FROM node:20.10.0-alpine AS builder

WORKDIR /app

# Copy configuration files first
COPY FrontEnd/package*.json ./
COPY FrontEnd/.eslintrc.json ./
COPY FrontEnd/next.config.cjs ./
COPY FrontEnd/jest.config.cjs ./

# Install dependencies with clean slate
RUN npm cache clean --force && \
    npm install --legacy-peer-deps

# Copy the rest of the frontend code
COPY FrontEnd/ .

# Build with verbose output and error handling
RUN npm run build || (cat .next/error.log && exit 1)

# Production stage
FROM node:20.10.0-alpine

WORKDIR /app

# Copy built assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]