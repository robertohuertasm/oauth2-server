 export const config = {
  secret: '1234567890', // used to sign the tokens.
  issuer: 'LS-AS',
  cleanTimeMs: 1000 * 60 * 60,
  port: 3000,
  accessTokenLength: 256,
  database: 'localhost/authorization-server',
  testClient: {
    name: 'test-client',
    clientId: '2c9019fa0b2c4ac2bb54e3b23af583b1',
    clientSecret: 'Wst2a35X-jAXoX2FaqKVN-l5cV5QvZ4Rs0XJ1lX_Rc4',
    accessTokenTTL: 2592000, // 1 month
    refreshTokenTTL: 311040000, // 10 years
    refreshTokenLength: 20,
    authorizationCodeLength: 16,
    returnURI: 'http://localhost:3000',
    renewRefreshToken: true,
    resourceServerId: '2c9019fa0b2c4ac2bb54e3b23af583b1',
  },
  testUser: {
    id: -1000,
    username: 'test',
    password: 'test',
    name: 'Charles Brownson',
  },
  testResourceServer: {
    name: 'test-resourceserver',
    id: '2c9019fa0b2c4ac2bb54e3b23af583b1',
    secret: 'Wst2a35X-jAXoX2FaqKVN-l5cV5QvZ4Rs0XJ1lX_Rc4',
    active: true,
  },
  session: {
    maxAge: 3600 * 60 * 24 * 7,
    secret: '0987654321',
    name: 'ls-oauth-session.sid',
  },
};
