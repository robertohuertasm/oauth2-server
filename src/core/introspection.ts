import * as jwt from 'jsonwebtoken';
import { IResourceServer, IData } from '../db/interfaces';
import { config } from './config';
import { checkExpiration } from '../grants/shared/accessToken';

let data: IData = null;

const tokens = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
};

function checkAccessToken(token: string, rs: IResourceServer): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // 1. check existence in db
      const decoded = jwt.verify(token, config.secret, {
        issuer: config.issuer,
      });
      if (!decoded) { return resolve(false); }
      // 2. check existence in db
      return data.AccessTokenModel.findByToken(token).
        then(tk => {
          if (!tk) { return resolve(false); }
          // 3. check that the ClientId can access this resource server
          data.ClientModel.findByClientId(tk.clientId)
            .then(client => {
              if (!client) { return resolve(false); }
              if (client.resourceServerId !== rs.id) { return resolve(false); }
              return resolve(true);
            })
            .catch(err => resolve(false));
        })
        .catch(err => resolve(false));
    } catch (error) {
      resolve(false);
    }
  });
}

function checkRefreshToken(token: string, rs: IResourceServer): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      return data.RefreshTokenModel.findByToken(token).
        then(tk => {
          if (!tk) { return resolve(false); }
          // 1. check expiration date
          if (!checkExpiration(tk.expirationDate)) { return resolve(false); }
          // 2. check that the ClientId can access this resource server
          data.ClientModel.findByClientId(tk.clientId)
            .then(client => {
              if (!client) { return resolve(false); }
              if (client.resourceServerId !== rs.id) { return resolve(false); }
              return resolve(true);
            })
            .catch(err => resolve(false));
        })
        .catch(err => resolve(false));
    } catch (error) {
      resolve(false);
    }
  });
}

export function introspection(db: IData) {
  data = db;
  return introspectionImpl;
}

function introspectionImpl(req, res, next: (args?) => any): Promise<void> {
  const rs: IResourceServer = req.rs;
  const token: string = req.body.token;
  const hint: string = req.body.token_type_hint;
  if (!token) { return next(new Error('No token passed as a parameter')); }

  function response(alternateFunction: () => Promise<any> = null) {

    function resolve(result: boolean) {
      res.send({
        active: result,
      });
      next();
    }

    return (result: boolean) => {
      if (alternateFunction && !result) {
        alternateFunction()
          .then(resolve)
          .catch(err => { next(err); });
      } else {
        resolve(result);
      }
    };
  }

  if (hint) {
    if (hint === tokens.accessToken) {
      return checkAccessToken(token, rs)
        .then(response(() => checkRefreshToken(token, rs)))
        .catch(err => { next(err); });
    } else {
      return checkRefreshToken(token, rs)
        .then(response(() => checkAccessToken(token, rs)))
        .catch(err => { next(err); });
    }
  } else {
    // let's assume it's an access token.
    const tk = jwt.decode(token, { json: true });
    if (tk) {
      return checkAccessToken(token, rs)
        .then(response())
        .catch(err => { next(err); });
    } else {
      // refresh token
      return checkRefreshToken(token, rs)
        .then(response())
        .catch(err => { next(err); });
    }
  }
}
