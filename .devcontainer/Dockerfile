FROM node:20-alpine
WORKDIR /workspaces/minimalreactmariadbapp
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]
