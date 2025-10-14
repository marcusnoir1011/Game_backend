# User official node.js image
# version 18 as the base
FROM node:18

# Set workign directory inside the container
WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy all other files
COPY . .

# Build Typescript files
RUN npm run build

# Expose port
EXPOSE 3030

# Start app
RUN npm run build
CMD ["node", "dist/index.js"]