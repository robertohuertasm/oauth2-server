import { start } from '../../src/grants/implicit';

describe('unit: implicit grant tests', () => {
  it('on start server grant function gets called', () => {
    const server = {
      grant: jest.fn(fn => null),
    };
    const oauth = {
      grant: {
        token: jest.fn((client, scope, done) => null),
      },
    };
    start(server, oauth, null);
    expect(server.grant).toBeCalled();
    expect(oauth.grant.token).toBeCalled();
  });
});
