import * as data from '../db';
import { config } from './config';

setInterval(() => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  data.AccessTokenModel.remove({ expirationDate: { $lt: now } });
  data.RefreshTokenModel.remove({ expirationDate: { $lt: now } });
  data.AuthorizationCodeModel.remove({ createdAt: {$lt: yesterday } });
}, config.cleanTimeMs);
