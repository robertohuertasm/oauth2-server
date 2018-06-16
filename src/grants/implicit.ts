import { createToken } from './shared/accessToken';
import { IData } from '../db/interfaces';

export function start(server, oauth, data: IData) {
  server.grant(oauth.grant.token((client, user, ares, done) =>
    createToken({data, user, client, scope: client.scope, done, isImplicitGrant: true })));
}
