import * as mongoose from 'mongoose';
import { startExtensions } from './extensions';

export const accessTokens = new mongoose.Schema({
  token: String,
  expirationDate: { type: Date, default: Date.now },
  userId: String,
  clientId: String,
  scope: String,
  issuedDate: { type: Date, default: Date.now },
});

export const refreshTokens = new mongoose.Schema({
  token: String,
  expirationDate: { type: Date, default: Date.now },
  userId: String,
  clientId: String,
  scope: String,
  issuedDate: { type: Date, default: Date.now },
});

export const clients = new mongoose.Schema({
  name: String,
  clientId: String,
  clientSecret: String,
  accessTokenTTL: Number,
  refreshTokenTTL: Number,
  refreshTokenLength: Number,
  authorizationCodeLength: Number,
  returnURI: String,
  renewRefreshToken: Boolean,
  resourceServerId: String,
});

export const authorizationCodes = new mongoose.Schema({
  code: String,
  clientId: String,
  redirectUri: String,
  userId: String,
  scope: String,
  createdAt: Date,
});

export const resourceServers = new mongoose.Schema({
  name: String,
  id: String,
  secret: String,
  active: Boolean,
});

// this schema is just for testing purposes
export const users = new mongoose.Schema({
  id: Number,
  username: String,
  password: String,
  name: String,
});

startExtensions(accessTokens, refreshTokens, clients, authorizationCodes, resourceServers, users);
