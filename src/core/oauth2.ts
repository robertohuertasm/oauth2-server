import * as oauth from 'oauth2orize';
import * as code from '../grants/code';
import * as implicit from '../grants/implicit';
import * as password from '../grants/password';
import * as clientcredentials from '../grants/clientcredentials';
import * as refreshtoken from '../grants/refreshtoken';
import { setUp as serializationSetup } from './serialization';
import { IData } from '../db/interfaces';

export function setUp(data: IData): any {
  const server = oauth.createServer();
  serializationSetup(server);
  code.start(server, oauth, data);
  implicit.start(server, oauth, data);
  password.start(server, oauth, data);
  clientcredentials.start(server, oauth, data);
  refreshtoken.start(server, oauth, data);
  return server;
}
