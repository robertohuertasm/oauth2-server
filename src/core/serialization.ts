import * as passport from 'passport';
import * as data from '../db';
import { IClientModel } from '../db/interfaces';

interface IClientInfo { id: string; scope: string; }

export function setUp(server) {

  server.serializeClient((client: IClientModel, done) => {
    return done(null, { id: client.clientId, scope: client.scope });
  });

  server.deserializeClient((clientInfo: IClientInfo, done) => {
    data.ClientModel.findByClientId(clientInfo.id)
      .then(client => {
        if (!client) {
          return done(null, false);
        } else {
          client.scope = clientInfo.scope;
          return done(null, client);
        }
      })
      .catch(err => { if (err) { return done(err); } });
  });

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    data.UserModel.findOneBy('id', id)
      .then(user => {
        if (!user) {
          done(null, false);
        } else {
          done(null, user);
        }
      })
      .catch(err => { if (err) { return done(err, false); } });
  });
}
