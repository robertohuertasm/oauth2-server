import { IClientModel, IData } from '../db/interfaces';
import { createToken, checkExpiration } from './shared/accessToken';

export function start(server, oauth, data: IData) {
  server.exchange(oauth.exchange.refreshToken((client: IClientModel, refreshToken, scope, done) => {
    if (!refreshToken) { return done(null, false); }
    data.RefreshTokenModel.findByToken(refreshToken)
      .then(rft => {
        if (
          !rft ||
          client.clientId !== rft.clientId ||
          !rft.userId ||
          !checkExpiration(rft.expirationDate)) {
          return done(null, false);
        }
        data.UserModel.findOneBy('id', rft.userId)
          .then(user => {
            if (!user) { return done(null, false); }
            // create new token, save it and return it.
            return createToken({
              data,
              user,
              client,
              scope,
              done,
              refreshToken: rft});
          });
      })
      .catch(err => { if (err) { return done(err); } });
  }));
}
