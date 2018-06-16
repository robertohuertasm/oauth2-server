import { start } from '../../src/grants/clientcredentials';

describe('unit: client credentials grant tests', () => {
  it('on start server exchange function gets called', () => {
    const server = {
      exchange: jest.fn(fn => null),
    };
    const oauth = {
      exchange: {
        clientCredentials: jest.fn((client, scope, done) => null),
      },
    };
    start(server, oauth, null);
    expect(server.exchange).toBeCalled();
    expect(oauth.exchange.clientCredentials).toBeCalled();
  });
});
