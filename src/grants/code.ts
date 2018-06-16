import uid = require('uid2');
import { IClient, IUser, IData } from '../db/interfaces';
import { createToken } from './shared/accessToken';

export function start(server, oauth, data: IData) {
  // authorization_code grant
  server.grant(oauth.grant.code((client: IClient, redirectURI, user: IUser, ares, done) => {
    const code = uid(client.authorizationCodeLength);
    new data.AuthorizationCodeModel({
      code,
      clientId: client.clientId,
      redirectUri: redirectURI,
      userId: user.id,
      scope: client.scope,
      createdAt: new Date(),
    })
      .save(err => {
        return done(err, code);
      })
      .catch(saveError => { if (saveError) { return done(saveError); } });
  }));

  // code exchange
  server.exchange(oauth.exchange.code((client: IClient, code, redirectURI, done) => {
    data.AuthorizationCodeModel.findOneBy('code', code)
      .then(authCode => {
        if (!authCode) {
          return done(null, false);
        }
        if (client.clientId !== authCode.clientId) {
          return done(null, false);
        }
        if (redirectURI !== authCode.redirectUri) {
          return done(null, false);
        }
        data.AuthorizationCodeModel.remove({ code: authCode.code })
          .then(result => {
            const res: any = result; // typescript thing!
            if (res !== undefined && res === 0) {
              return done(null, false);
            }
            data.UserModel.findOneBy('id', authCode.userId)
              .then(user => {
                if (!user) {
                  return done(null, false);
                }
                return createToken({ data, user, client, scope: client.scope, done });
              })
              .catch(err => { if (err) { return done(err); } });
          })
          .catch(err => { if (err) { return done(err); } });
      })
      .catch(err => { if (err) { return done(err); } });
  }));
}

export function authorization(data: IData) {
  return (clientId, redirectURI, scope, done) => {
    data.ClientModel.findByClientId(clientId)
      .then(client => {
        if (!client || client.returnURI !== redirectURI) {
          return done(null, false);
        }
        if (scope && scope.length) {
          client.scope = scope[0];
        }
        return done(null, client, redirectURI);
      })
      .catch(err => { if (err) { return done(err); } });
  };
}

export function authorizationRender(data: IData) {
  return (req, res, next) => {
    data.ClientModel.findByClientId(req.query.client_id)
      .then(client => {
        // check if it's a trusted client
        res.render('code', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
      })
      .catch(err => { if (err) { return next(err); } });
  };
}
