FROM node:8

# Create app directory
WORKDIR /app/src

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY . .

#npm
RUN npm install -g jshint
RUN npm install

#variables
ENV APP_ID 14564
ENV PRIVATE_KEY_PATH ./little-smart.2018-07-10.private-key.pem

EXPOSE 8080
ENTRYPOINT [ "npm", "start","./index.js" ]
