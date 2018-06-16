import { IClient, IUser, IData } from '../db/interfaces';
import { createToken } from './shared/accessToken';

export function start(server, oauth, data: IData) {
  server.exchange(oauth.exchange.password(
    (client: IClient, username, password, scope, done) => {
      if (!username || !password) { return done(null, false); }
      data.UserModel.findOne({ username, password })
        .then((user: IUser) => {
          if (!user) {
            return done(null, false);
          } else {
            return createToken({ data, user, client, scope, done });
          }
        })
        .catch(err => { if (err) { return done(err); } });
    },
  ));
}
