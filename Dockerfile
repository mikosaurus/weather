FROM node:18-slim

WORKDIR /app
COPY ./ /app
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build
EXPOSE 4200
CMD ["node", "index.js"]