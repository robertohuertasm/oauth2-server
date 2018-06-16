import { setUp } from '../../src/core/serialization';

describe('unit: oauth2 tests', () => {
  it ('server is not null', () => {
    const server = {
      serializeClient: jest.fn(fn => null),
      deserializeClient: jest.fn(fn => null),
    };
    setUp(server);
    expect(server.serializeClient.mock.calls.length).toBe(1);
    expect(server.serializeClient.mock.calls[0][0].length).toBe(2);
    expect(server.deserializeClient.mock.calls.length).toBe(1);
    expect(server.deserializeClient.mock.calls[0][0].length).toBe(2);
  });
});
