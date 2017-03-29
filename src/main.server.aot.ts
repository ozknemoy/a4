/**
 * This file should be temporary
 * See https://github.com/angular/angular-cli/pull/5194
 */
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';
import * as express from 'express';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { ServerAppModuleNgFactory } from './ngfactory/app/server-app.module.ngfactory';
import { ngExpressEngine } from './modules/ng-express-engine/express-engine';
import { ROUTES } from './routes';
//import { App } from './api/app';
import { enableProdMode } from '@angular/core';
enableProdMode();
const app = express();
//const api = new App();
const port = 3000;
const baseUrl = `http://localhost:${port}`;

app.engine('html', ngExpressEngine({
  aot: true,
  bootstrap: ServerAppModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', 'src');

app.use('/', express.static('dist', { index: false }));

ROUTES.forEach(route => {
  app.get(route, (req, res) => {
    console.time(`render view : ${req.originalUrl}`);
    res.render('../dist/index', {//./index
      req: req,
      res: res
    });
    console.timeEnd(`render view : ${req.originalUrl}`);
  });
});

/*app.get('/data', (req, res) => {
  console.time(`GET: ${req.originalUrl}`);
  res.json(api.getData());
  console.timeEnd(`GET: ${req.originalUrl}`);
});*/

app.listen(port, () => {
  console.log(`Listening at ${baseUrl}`);
});
