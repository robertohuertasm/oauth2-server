import { setUp } from '../../src/core/oauth2';

describe('unit: oauth2 tests', () => {
  it ('server is not null', () => {
    const server = setUp(null);
    expect(server).not.toBeNull();
    expect(server._serializers.length).toBe(1);
    expect(server._deserializers.length).toBe(1);
  });
});
