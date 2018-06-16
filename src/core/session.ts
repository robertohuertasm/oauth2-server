import { RequestHandler } from 'express';
import * as expressSession from 'express-session';
import * as connectMongo from 'connect-mongo';
import { config } from './config';
import { Connection } from 'mongoose';

export function setUp(isProduction: boolean,  connection: Connection): RequestHandler {

  // tslint:disable-next-line variable-name
  const MongoStore = connectMongo(expressSession);
  const mongooseOptions: connectMongo.MogooseConnectionOptions = {
    mongooseConnection: connection,
  };

  const sessionOptions: expressSession.SessionOptions = {
    secret: config.session.secret,
    name: config.session.name,
    proxy: true,
    store: new MongoStore(mongooseOptions),
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: config.session.maxAge, secure: isProduction },
  };

  return expressSession(sessionOptions);
}
