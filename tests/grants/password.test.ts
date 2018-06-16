import { start } from '../../src/grants/password';

describe('unit: password grant tests', () => {
  it('on start server exchange function gets called', () => {
    const server = {
      exchange: jest.fn(fn => null),
    };
    const oauth = {
      exchange: {
        password: jest.fn((client, scope, done) => null),
      },
    };
    start(server, oauth, null);
    expect(server.exchange).toBeCalled();
    expect(oauth.exchange.password).toBeCalled();
  });
});
