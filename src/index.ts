import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as data from './db';
import { setUp as oauth2Setup } from './core/oauth2';
import { setUp as sessionSetup } from './core/session';
import { buildEndPoints } from './core/endpoints';
import { config } from './core/config';
import './core/cleaning';

const server = oauth2Setup(data);
const app = express();
const isProduction = app.get('env') === 'production';
// views
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
// setup
app.use(sessionSetup(isProduction, data.db));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

import './core/auth';
const endPoints = buildEndPoints(server, data);
// routes
app.get('/', endPoints.index);
app.get('/login', endPoints.loginForm);
app.post('/login', endPoints.login);
app.get('/logout', endPoints.logout);

app.get('/oauth', endPoints.authorization);
app.post('/oauth/decision', endPoints.decision);
app.post('/oauth/token', endPoints.token);
app.post('/oauth/introspection', endPoints.introspection);

// error control
const error: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    res.status(err.status);
    res.json(err);
  } else {
    next();
  }
};
app.use(error);

data.db.once('open', () => {
  app.listen(config.port);
  // tslint:disable-next-line no-console
  console.log(`OAuth2 server started on port ${config.port}`);
});
