# Build stage
FROM node:18-alpine AS builder

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Copy application code
COPY . .

# Set API URL from build arg
ARG API_URL
ENV NEXT_PUBLIC_API_URL=$API_URL
# Build the application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directory structure
RUN mkdir -p /usr/share/nginx/html/modifier/toolbar

# Copy built static files from builder stage
COPY --from=builder /app/public /usr/share/nginx/html/modifier/public
COPY --from=builder /app/public/toolbar /usr/share/nginx/html/toolbar
COPY --from=builder /app/dist /usr/share/nginx/html/modifier

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"] 