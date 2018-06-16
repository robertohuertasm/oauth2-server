import { collections } from './collections';
import * as mongoose from 'mongoose';

export function startExtensions(
  accessTokens: mongoose.Schema,
  refreshTokens: mongoose.Schema,
  clients: mongoose.Schema,
  authorizationCodes: mongoose.Schema,
  resourceServers: mongoose.Schema,
  users: mongoose.Schema) {

  // we need some of the function to get the context dynamically so ...
  // tslint:disable only-arrow-functions

  // generic function
  function findBy<T>(collection: string): (property: string, value: any) => Promise<T[]> {
    return function (property: string, value: any): Promise<T[]> {
      return this.model(collection).find({ [property]: value });
    };
  }

  function findOneBy<T>(collection: string): (property: string, value: any) => Promise<T> {
    return function (property: string, value: any): Promise<T> {
      return this.model(collection).findOne({ [property]: value });
    };
  }

  // tslint:disable-next-line:ban-types
  function findByName<T>(collection: { statics: { findOneBy: (Function) } }): (value: string) => Promise<T> {
    return function (value: string): Promise<T> {
      return collection.statics.findOneBy.bind(this, 'name', value)();
    };
  }

  // accessTokens
  accessTokens.statics.findBy = findBy(collections.accessTokens);
  accessTokens.statics.findOneBy = findOneBy(collections.accessTokens);
  accessTokens.statics.findByName = findByName(accessTokens);

  accessTokens.statics.findByToken = function (token) {
    return accessTokens.statics.findOneBy.bind(this, 'token', token)();
  };

  // refreshtokens
  refreshTokens.statics.findBy = findBy(collections.refreshTokens);
  refreshTokens.statics.findOneBy = findOneBy(collections.refreshTokens);
  refreshTokens.statics.findByName = findByName(refreshTokens);

  refreshTokens.statics.findByToken = function (token) {
    return refreshTokens.statics.findOneBy.bind(this, 'token', token)();
  };

  // authorizationCodes
  authorizationCodes.statics.findBy = findBy(collections.authorizationCodes);
  authorizationCodes.statics.findOneBy = findOneBy(collections.authorizationCodes);
  authorizationCodes.statics.findByName = findByName(authorizationCodes);

  // clients
  clients.statics.findBy = findBy(collections.clients);
  clients.statics.findOneBy = findOneBy(collections.clients);
  clients.statics.findByName = findByName(clients);

  clients.statics.findByClientId = function (clientId) {
    return clients.statics.findOneBy.bind(this, 'clientId', clientId)();
  };

  // resourceServers
  resourceServers.statics.findBy = findBy(collections.resourceServers);
  resourceServers.statics.findOneBy = findOneBy(collections.resourceServers);
  resourceServers.statics.findByName = findByName(resourceServers);

  // users
  users.statics.findBy = findBy(collections.users);
  users.statics.findOneBy = findOneBy(collections.users);
  users.statics.findByName = findByName(users);

}
