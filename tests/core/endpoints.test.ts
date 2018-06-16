import { buildEndPoints } from '../../src/core/endpoints';

function mockServer() {
  const server = {
    authorization: jest.fn(fn => null),
    decision: jest.fn(),
    token: jest.fn(),
    errorHandler: jest.fn(),
  };
  return server;
}

describe('unit: testing endpoints', () => {
  it ('returns an object', () => {
    const server = mockServer();
    const ep = buildEndPoints(server, null);
    expect(ep).toBeInstanceOf(Object);
  });

  it ('returns all endpoints', () => {
    const server = mockServer();
    const ep = buildEndPoints(server, null);
    expect(ep.index).toBeInstanceOf(Function);
    expect(ep.loginForm).toBeInstanceOf(Function);
    expect(ep.login.length).toBe(1);
    expect(ep.logout).toBeInstanceOf(Function);
    expect(ep.authorization.length).toBe(3);
    expect(ep.decision.length).toBe(2);
    expect(ep.token.length).toBe(3);
    expect(ep.introspection.length).toBe(3);
  });

  it ('server functions get called', () => {
    const server = mockServer();
    const ep = buildEndPoints(server, null);
    const spy = {
      logout: jest.fn(),
      render: jest.fn(path => null),
      redirect: jest.fn(path => null),
    };
    ep.index(null, spy);
    ep.loginForm(null, spy);
    ep.logout(spy, spy);
    expect(spy.render.mock.calls[0][0]).toBe('index');
    expect(spy.render.mock.calls[1][0]).toBe('login');
    expect(spy.logout.mock.calls.length).toBe(1);
    expect(spy.redirect.mock.calls[0][0]).toBe('/');
  });

});
