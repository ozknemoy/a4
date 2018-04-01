import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';
import * as express from 'express';
import { platformServer, renderModuleFactory } from '@angular/platform-server';
import { ServerAppModule } from './app/server-app.module';
import { ngExpressEngine } from './modules/ng-express-engine/express-engine';
import {ROUTES as FRONT_ROUTES} from "./app/app.module";
import { enableProdMode } from '@angular/core';
enableProdMode();
const app = express();
const port = 3000;
const baseUrl = `http://localhost:${port}`;

app.engine('html', ngExpressEngine(<any>{bootstrap: ServerAppModule}));

app.set('view engine', 'html');
app.set('views', 'src');

app.use('/', express.static('dist', {index: false}));

const ROUTES = [];
FRONT_ROUTES.forEach((route:any)=> {
    ROUTES.push('/' + route.path);
    if(route.children) {
        route.children.forEach(child=> {
            ROUTES.push('/' + route.path + '/' + child.path);
            if(child.children) {
                child.children.forEach(grandchild=> {
                    ROUTES.push('/' + route.path + '/' + child.path + '/' + grandchild.path)
                })
            }
        })
    }
});

ROUTES.forEach(route => {
  app.get(route, (req, res) => {
    //console.time(`render view : ${req.originalUrl}`);
    res.render('../dist/index', {
      req: req,
      res: res
    });
    //console.timeEnd(`render view : ${req.originalUrl}`);
  });
});



app.listen(port,() => {
	console.log(`Listening at ${baseUrl}`);
});
