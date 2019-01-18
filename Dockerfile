### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:10-alpine as builder

ARG APP_ENV=local

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i -g npm
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
# RUN $(npm bin)/ng build --prod --build-optimizer
RUN npm run build-${APP_ENV}

# RUN ls /ng-app/dist

### STAGE 2: Setup ###

# Multiple FROM commands are totally valid; the last one will create the resulting image
FROM nginx:1.14.2-alpine

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html

COPY setenv.sh /usr/share
RUN chmod +x /usr/share/setenv.sh

# RUN ls /usr/share/nginx/html

CMD /usr/share/setenv.sh && sleep 3 && nginx -g 'daemon off;'
