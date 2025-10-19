# User official node.js image
# version 18 as the base
FROM node:18

# Set workign directory inside the container
WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all other files
COPY . .

# Build Typescript files
RUN npm run build

# Now prune dev deps to kepp image small
RUN npm prune --omit=dev

# Expose port
EXPOSE 3030

# Start app
RUN npm run build
CMD ["node", "start"]