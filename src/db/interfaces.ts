import * as mongoose from 'mongoose';

interface IFindBy<T> {
  findBy: (property: string, value: any) => Promise<T[]>;
  findOneBy: (property: string, value: any) => Promise<T>;
  findByName: (name: string) => Promise<T>;
}

export interface IData {
  db: mongoose.Connection;
  AccessTokenModel: ITokenModelStatic;
  RefreshTokenModel: ITokenModelStatic;
  ClientModel: IClientModelStatic;
  AuthorizationCodeModel: IAuthorizationCodeModelStatic;
  ResourceServerModel: IResourceServerModelStatic;
  UserModel: IUserModelStatic;
}

export interface IToken {
  token: string;
  expirationDate: number;
  userId: string;
  clientId: string;
  scope: string;
  issuedDate: number;
}

export interface ITokenModel extends IToken, mongoose.Document {}
export interface ITokenModelStatic
  extends mongoose.Model<ITokenModel>,
    IFindBy<IToken> {
  findByToken: (token: string) => Promise<IToken>;
}

export interface IClient {
  name: string;
  clientId: string;
  clientSecret: string;
  scope?: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
  refreshTokenLength: number;
  authorizationCodeLength: number;
  returnURI?: string;
  renewRefreshToken: boolean;
  resourceServerId: string;
}

export interface IClientModel extends IClient, mongoose.Document {}
export interface IClientModelStatic
  extends mongoose.Model<IClientModel>,
    IFindBy<IClient> {
  findByClientId: (clientId: string) => Promise<IClientModel>;
}

export interface IAuthorizationCode {
  code: string;
  clientId: string;
  redirectUri: string;
  userId: number;
  scope: string;
  createdAt: Date;
}

export interface IAuthorizationCodeModel
  extends IAuthorizationCode,
    mongoose.Document {}
export interface IAuthorizationCodeModelStatic
  extends mongoose.Model<IAuthorizationCodeModel>,
    IFindBy<IAuthorizationCode> {}

export interface IResourceServer {
  name: string;
  id?: any;
  secret: string;
  active: boolean;
}

export interface IResourceServerModel
  extends IResourceServer,
    mongoose.Document {}
export interface IResourceServerModelStatic
  extends mongoose.Model<IResourceServerModel>,
    IFindBy<IResourceServer> {}

// this schema is just for testing purposes
export interface IUser {
  id?: any;
  username: string;
  password: string;
  name: string;
}

export interface IUserModel extends IUser, mongoose.Document {}
export interface IUserModelStatic
  extends mongoose.Model<IUserModel>,
    IFindBy<IUser> {}
