import { start } from '../../src/grants/refreshtoken';

describe('unit: refreshtoken tests', () => {

  it('On start server and oauth methods will be called', () => {
    const server = {
      exchange: jest.fn(fn => null),
    };
    const oauth = {
      exchange: {
        refreshToken: jest.fn((client, refreshToken, scope, done) => null),
      },
    };
    start(server, oauth, null);
    expect(server.exchange).toBeCalled();
    expect(oauth.exchange.refreshToken).toBeCalled();
  });
});
