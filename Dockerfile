# build stage
FROM node:lts-alpine AS build-stage
# copy everything
COPY . /app
WORKDIR /app

ARG API_URL
ENV VITE_API_URL=$API_URL

RUN npm install
RUN npm run build

# build a Image for editor-frontend:latest based on nginx
FROM nginx:stable-alpine AS production-stage

# Copy built files from the builder stage to the Nginx static file directory
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the Nginx config file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 for the server
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]