import { introspection } from '../../src/core/introspection';
import { config } from '../../src/core/config';

// tslint:disable-next-line max-line-length
const act = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQ2hhcmxlcyBCcm93bnNvbiIsInVzciI6LTEwMDAsImlhdCI6MTQ3ODUyMzc1MywiZXhwIjoxNDgyNTk0Mjc3MzEwLCJhdWQiOiJ0ZXN0IiwiaXNzIjoiTFMtQVMiLCJzdWIiOiJ0ZXN0In0.cxQfZVc26iFm3Ljw2OOfs0pMnYaz2wB5VGlz7qmJtLo';

const rft = '0lcEm538Cb49NBkxCkaY';

interface IMockOptions {
  token: string;
  accessTokenResolve?: object;
  refreshTokenResolve?: object;
  hint?: string;
  expiration?: number;
}

function buildMock(options: IMockOptions) {
  const req = {
    body: {
      token: options.token,
      token_type_hint: options.hint || null,
    },
    rs: {
      id: config.testResourceServer.id,
    },
  };
  const res = { send: jest.fn(x => x) };
  const next = jest.fn(x => x);

  function returnNotUndefined(first, second) {
    if (first === undefined) { return second; }
    return first;
  }

  const data: any = {
    AccessTokenModel: {
      findByToken: () => new Promise((resolve, reject) => {
        const result = returnNotUndefined(options.accessTokenResolve, { clientId: config.testClient.clientId });
        resolve(result);
      }),
    },
    ClientModel: {
      findByClientId: () => new Promise((resolve, reject) => {
        resolve({ resourceServerId: config.testClient.resourceServerId });
      }),
    },
    RefreshTokenModel: {
      findByToken: () => new Promise((resolve, reject) => {
        const result = returnNotUndefined(options.refreshTokenResolve,
          { expirationDate: new Date().getTime() + (options.expiration || 0) });
        resolve(result);
      }),
    },
  };
  return { req, res, next, data };
}

describe('unit: introspection tests', () => {

  it('if no token an error is thrown', () => {
    const req = {
      body: {
        token: null,
        token_type_hint: null,
      },
    };
    const next = jest.fn(x => x);
    introspection(null)(req, null, next);
    expect(next.mock.calls[0][0].message).toBe('No token passed as a parameter');
  });

  it('Access token gets correctly decoded without hint', () => {
    const mock = buildMock({ token: act });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(true);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('Refresh token gets correctly decoded without hint', () => {
    const mock = buildMock({ token: rft, expiration: 6000000 });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(true);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('Access token gets correctly decoded with hint', () => {
    const mock = buildMock({ token: act, hint: 'access_token' });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(true);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('Refresh token gets correctly decoded with hint', () => {
    const mock = buildMock({ token: rft, hint: 'refresh_token', expiration: 6000000 });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(true);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('Access token gets correctly decoded with wrong hint', () => {
    const mock = buildMock({
      token: act,
      hint: 'refresh_token',
      refreshTokenResolve: null });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      setTimeout(() => {
        expect(mock.res.send.mock.calls[0][0].active).toBe(true);
        expect(mock.next.mock.calls.length).toBe(1);
      });
    });
  });

  it('Refresh token gets correctly decoded with wrong hint', () => {
    const mock = buildMock({
      token: rft,
      hint: 'access_token',
      expiration: 6000000,
      accessTokenResolve: null,
    });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      setTimeout(() => {
        expect(mock.res.send.mock.calls[0][0].active).toBe(true);
        expect(mock.next.mock.calls.length).toBe(1);
      }, 4000);
    });
  });

  it('Access token fails when not correct', () => {
    const mock = buildMock({ token: act.slice(1, 10), refreshTokenResolve: null });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(false);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('refresh token fails when not correct', () => {
    const mock = buildMock({ token: rft.slice(1, 10), refreshTokenResolve: null });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(false);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('Access token fails when not correct with correct hint', () => {
    const mock = buildMock({
      token: act.slice(1, 10),
      refreshTokenResolve: null,
      hint: 'access_token' });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(false);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('refresh token fails when not correct with correct hint', () => {
    const mock = buildMock({
      token: rft.slice(1, 10),
      refreshTokenResolve: null,
      hint: 'refresh_token',
    });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      expect(mock.res.send.mock.calls[0][0].active).toBe(false);
      expect(mock.next.mock.calls.length).toBe(1);
    });
  });

  it('Access token fails when not correct with incorrect hint', () => {
    const mock = buildMock({
      token: act.slice(1, 10),
      refreshTokenResolve: null,
      hint: 'refresh_token' });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
      setTimeout(() => {
        expect(mock.res.send.mock.calls[0][0].active).toBe(false);
        expect(mock.next.mock.calls.length).toBe(1);
      }, 4000);
    });
  });

  it('refresh token fails when not correct with incorrect hint', () => {
    const mock = buildMock({
      token: rft.slice(1, 10),
      refreshTokenResolve: null,
      hint: 'access_token',
    });
    const r = introspection(mock.data)(mock.req, mock.res, mock.next);
    return r.then(rs => {
     setTimeout(() => {
        expect(mock.res.send.mock.calls[0][0].active).toBe(false);
        expect(mock.next.mock.calls.length).toBe(1);
      }, 4000);
    });
  });

});
