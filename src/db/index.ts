import * as mongoose from 'mongoose';
import * as schemas from './schema';
import {
  ITokenModel,
  ITokenModelStatic,
  IClientModel,
  IClientModelStatic,
  IAuthorizationCodeModel,
  IAuthorizationCodeModelStatic,
  IUserModel,
  IUserModelStatic,
  IResourceServerModel,
  IResourceServerModelStatic,
} from './interfaces';
import { config } from '../core/config';
import { collections } from './collections';
import { initDb } from './dbInit';

(mongoose as any).Promise = Promise;
mongoose.connect(`mongodb://${config.database}`);

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));

/* tslint:disable variable-name */
export const AccessTokenModel =
  mongoose.model<ITokenModel>(
    collections.accessTokens,
    schemas.accessTokens) as ITokenModelStatic;

export const RefreshTokenModel =
  mongoose.model<ITokenModel>(
    collections.refreshTokens,
    schemas.refreshTokens) as ITokenModelStatic;

export const ClientModel =
  mongoose.model<IClientModel>(
    collections.clients,
    schemas.clients) as IClientModelStatic;

export const AuthorizationCodeModel =
  mongoose.model<IAuthorizationCodeModel>(
    collections.authorizationCodes,
    schemas.authorizationCodes) as IAuthorizationCodeModelStatic;

export const ResourceServerModel =
  mongoose.model<IResourceServerModel>(
    collections.resourceServers,
    schemas.resourceServers,
  ) as IResourceServerModelStatic;

export const UserModel =
  mongoose.model<IUserModel>(
    collections.users,
    schemas.users) as IUserModelStatic;
/* tslint:enable */

initDb(db, ClientModel, UserModel, ResourceServerModel);
