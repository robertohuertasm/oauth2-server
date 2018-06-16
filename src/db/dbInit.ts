import {
  IClientModelStatic,
  IUserModelStatic,
  IResourceServerModelStatic,
} from './interfaces';
import { config } from '../core/config';
import { Connection } from 'mongoose';

/* tslint:disable variable-name no-console */
export function initDb(
  db: Connection,
  ClientModel: IClientModelStatic,
  UserModel: IUserModelStatic,
  ResourceServerModel: IResourceServerModelStatic): void {
  db.once('open', () => {
    // initialize database if not ready
    ClientModel.findByName(config.testClient.name)
      .then(client => {
        if (!client) {
          // create test token
          new ClientModel(config.testClient)
            .save()
            .catch(saveError => { if (saveError) { throw saveError; } });
        }
      })
      .catch(err => {
        console.error('Something went wrong trying to connect to the database', err);
      });

    UserModel.findByName(config.testUser.name)
      .then(user => {
        if (!user) {
          new UserModel(config.testUser)
            .save()
            .catch(saveError => { if (saveError) { throw saveError; } });
        }
      })
      .catch(err => {
        console.error('Something went wrong trying to connect to the database', err);
      });

    ResourceServerModel.findByName(config.testResourceServer.name)
      .then(rs => {
        if (!rs) {
          new ResourceServerModel(config.testResourceServer)
            .save()
            .catch(saveError => { if (saveError) { throw saveError; } });
        }
      })
      .catch(err => {
        console.error('Something went wrong trying to connect to the database', err);
      });

  });
}
