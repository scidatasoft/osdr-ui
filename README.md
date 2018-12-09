# OSDR Front-End

## Requirements

- [Node](https://nodejs.org) v6 or later

## Commands

*Current directory must be the `osdr.ui` repository*

```bash
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

[MongoDB](https://www.mongodb.com/)

[Angular CLI](https://github.com/angular/angular-cli)

## Links (front-end)

[Angular](http://angular.io/)

[Bootstrap](https://v4-alpha.getbootstrap.com/)

[TypeSript](https://www.typescriptlang.org/)

[SASS](http://sass-lang.com/)

[BOOTSTRAP4 components](https://valor-software.com/ngx-bootstrap/index-bs4.html#/)

[JSmol](http://wiki.jmol.org/index.php/Jmol_JavaScript_Object)

[ChemDoodle](https://web.chemdoodle.com/)

## Dockerization

Build (replace `dev` with `test`, `uat` etc)

```bash
docker build --build-arg APP_ENV=dev -t docker.your-company.com/osdr-ui:latest .
```

Run

```bash
docker run -d -p 5555:80 docker.your-company.com/osdr-ui:latest
```

Use OSDR docker-compose

```bash
cd ./../../osdr/Source/Services/.docker
docker-compose -f docker-compose.osdr.services.local.yml up
```
