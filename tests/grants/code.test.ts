import { start, authorization, authorizationRender } from '../../src/grants/code';

describe('unit: code grant tests', () => {
  it('on start server functions get called', () => {
    const server = {
      grant: jest.fn(fn => null),
      exchange: jest.fn(fn => null),
    };
    const oauth = {
      grant: {
        code: jest.fn((client, redirectUri, user, ares, done) => null),
      },
      exchange: {
        code: jest.fn((client, code, redirectUri, done) => null),
      },
    };
    start(server, oauth, null);
    expect(server.grant).toBeCalled();
    expect(server.exchange).toBeCalled();
    expect(oauth.grant.code).toBeCalled();
    expect(oauth.exchange.code).toBeCalled();
  });

  it('authorization returns a curried function', () => {
    const r = authorization(null);
    expect(r).toBeInstanceOf(Function);
    expect(r.length).toBe(4);
  });

  it('authorizationRender returns a curried function', () => {
    const r = authorizationRender(null);
    expect(r).toBeInstanceOf(Function);
    expect(r.length).toBe(3);
  });

  it('authorization: data.ClientModel.findbyClientId is called', () => {
    const data: any = {
      ClientModel: {
        findByClientId: jest.fn(clientId => new Promise((res, rej) => {
          res(true);
        })),
      },
    };
    authorization(data)('aafaf', null, null, null);
    expect(data.ClientModel.findByClientId).toBeCalled();
  });

  it('authorizationRender: data.ClientModel.findbyClientId is called', () => {
    const data: any = {
      ClientModel: {
        findByClientId: jest.fn(clientId => new Promise((res, rej) => {
          res(true);
        })),
      },
    };
    authorizationRender(data)({
      query: { client_id: '123'},
    }, null, null);
    expect(data.ClientModel.findByClientId).toBeCalled();
  });

});
