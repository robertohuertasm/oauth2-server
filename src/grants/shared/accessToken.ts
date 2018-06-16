import * as jwt from 'jsonwebtoken';
import uid = require('uid2');
import { config } from '../../core/config';
import { IClient, IUser, IToken, IData } from '../../db/interfaces';

export interface ITokenOptions {
  data: IData;
  user: IUser;
  client: IClient;
  scope: string;
  // tslint:disable-next-line:ban-types
  done: Function;
  refreshToken?: IToken;
  isImplicitGrant?: boolean;
}

function calculateExpirationDate(expirationSecs: number) {
  return new Date().getTime() + (expirationSecs * 1000);
}

export function checkExpiration(date: number): boolean {
  return date >= new Date().getTime();
}

export function createToken(options: ITokenOptions): any {
  if (!options.data) { throw new Error('data is a mandatory option and cannot be null/undefined'); }
  if (!options.client) { throw new Error('client is a mandatory option and cannot be null/undefined'); }
  if (!options.done) { throw new Error('done is a mandatory option and cannot be null/undefined'); }
  if (!(options.done instanceof Function)) { throw new Error('done option must be a function'); }

  const isCredGrant = !options.user;
  const payload = {
    name: isCredGrant ? null : options.user.name,
    usr: isCredGrant ? null : options.user.id,
    scp: options.scope,
  };

  const accessTokenExpirationDate = calculateExpirationDate(options.client.accessTokenTTL);
  const refreshTokenExpirationDate = calculateExpirationDate(options.client.refreshTokenTTL);
  const creationDate = new Date().getTime();

  const accessToken = jwt.sign(payload, config.secret, {
    issuer: config.issuer,
    subject: isCredGrant ? 'client-credentials' : options.user.username,
    audience: options.client.name,
    expiresIn: accessTokenExpirationDate,
    noTimestamp: false,
  });

  const at: IToken = {
    token: accessToken,
    expirationDate: accessTokenExpirationDate,
    userId: isCredGrant ? null : options.user.id,
    clientId: options.client.clientId,
    scope: options.scope,
    issuedDate: creationDate,
  };

  new options.data.AccessTokenModel(at).save().catch(err => { if (err) { return options.done(err); } });

  let rt: IToken = options.refreshToken;
  if (!rt || options.client.renewRefreshToken) {
    if (rt && options.client.renewRefreshToken) {
      options.data.RefreshTokenModel
        .remove({ token: rt.token })
        // .then(tk => {
        //   console.dir(tk);
        // })
        .catch(err => { if (err) { return options.done(err); } });
    }
    rt = {
      token: uid(options.client.refreshTokenLength),
      expirationDate: refreshTokenExpirationDate,
      userId: isCredGrant ? null : options.user.id,
      clientId: options.client.clientId,
      scope: options.scope,
      issuedDate: creationDate,
    };
    new options.data.RefreshTokenModel(rt).save().catch(err => { if (err) { return options.done(err); } });
  }
  if (options.isImplicitGrant) {
    return options.done(null, at.token);
  } else {
    return options.done(null, at.token, rt.token);
  }
}
