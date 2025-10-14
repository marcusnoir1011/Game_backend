# User official node.js image
# version 18 as the base
FROM node:18

# Set workign directory inside the container
WORKDIR /app

# Copy package.json first
COPY package*.json ./
RUN npm ci --omit=dev

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Expose port
EXPOSE 3030

# Start app
RUN npm run build
CMD ["npm", "start"]