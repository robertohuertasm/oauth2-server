import { createToken } from './shared/accessToken';
import { IData } from '../db/interfaces';

export function start(server, oauth, data: IData) {
  // client_credentials
  server.exchange(oauth.exchange.clientCredentials((client, scope, done) =>
    createToken({ data, user: null, client, scope, done})));
}
