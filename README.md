# Leanda Front-End

[![Build Status](https://travis-ci.org/ArqiSoft/leanda-ui.svg?branch=master)](https://travis-ci.org/ArqiSoft/leanda-ui)

## Requirements

- [Node](https://nodejs.org) v10 or later

## Commands

*Current directory must be the `leanda.ui` repository*

```terminal
npm install -g @angular/cli
npm i
npm run start-local
# or
npm run start-dev
```

And open <http://localhost:5555> via browser

## Configuration

- environment options: `/src/environment/environment.ts`
- Angular CLI options: `/angular-cli.json`

## Links (back-end)

[Node.js](https://nodejs.org)

[Angular CLI](https://github.com/angular/angular-cli)

## Links (front-end)

[Angular](http://angular.io/)

[Bootstrap](https://getbootstrap.com/)

[TypeSript](https://www.typescriptlang.org/)

[SASS](http://sass-lang.com/)

[BOOTSTRAP4 components](https://valor-software.com/ngx-bootstrap/index-bs4.html#/)

[JSmol](http://wiki.jmol.org/index.php/Jmol_JavaScript_Object)

[ChemDoodle](https://web.chemdoodle.com/)

## Dockerization

Build (replace `deploy` with `test`, `uat`, `dev` etc)

```terminal
docker build --build-arg APP_ENV=deploy -t leanda/ui:latest .
```

Build FVC

Replace API URLS in `src/environments/environment.deploy-fvc.ts`

```terminal
npm run build-deploy-fvc
```

Run

```terminal
docker run -d -p 5555:80 leanda/ui:latest
```

Use Leanda docker-compose

```terminal
docker-compose -f docker-compose.leanda.services.local.yml up
```
