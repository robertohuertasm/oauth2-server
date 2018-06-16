import { checkExpiration, createToken, ITokenOptions } from '../../src/grants/shared/accessToken';
import { IData, IClient } from '../../src/db/interfaces';

// tslint:disable:no-object-literal-type-assertion

describe('unit: checkExpiration tests', () => {

  it('checkExpiration returns true when date is greater than today', () => {
    const d = new Date().getTime() + 10000;
    const result = checkExpiration(d);
    expect(result).toBe(true);
  });

  // this test can fail but...
  it('checkExpiration returns true when date is the same as today', () => {
    const result = checkExpiration(new Date().getTime());
    expect(result).toBe(true);
  });

  it('checkExpiration returns false when date is lower than today', () => {
    const d = new Date().getTime() - 10000;
    const result = checkExpiration(d);
    expect(result).toBe(false);
  });

});

describe('unit: createToken tests', () => {
  it('if no data an exception is thrown', () => {
    const options: ITokenOptions = {
      data: null,
      client: null,
      user: null,
      done: null,
      scope: null,
    };
    expect(() => createToken(options)).toThrow();
  });

  it('if no client an exception is thrown', () => {
    const options: ITokenOptions = {
      data: {} as IData,
      client: null,
      user: null,
      done: null,
      scope: null,
    };
    expect(() => createToken(options)).toThrow();
  });

  it('if no done an exception is thrown', () => {
    const options: ITokenOptions = {
      data: {} as IData,
      client: {} as IClient,
      user: null,
      done: null,
      scope: null,
    };
    expect(() => createToken(options)).toThrow();
  });

  it('if done is not a function an exception is thrown', () => {
    const options: ITokenOptions = {
      data: {} as IData,
      client: {} as IClient,
      user: null,
      // tslint:disable-next-line:no-empty
      done: () => {},
      scope: null,
    };
    expect(() => createToken(options)).toThrow();
  });

  function createOptions(isImplicit) {
    function TokenStub(t) {
      return { save: () => ({ catch: () => null }) };
    }
    TokenStub.prototype.remove = () => ({catch: () => null });

    const options: ITokenOptions = {
      data: {
        RefreshTokenModel: TokenStub as any,
        AccessTokenModel: TokenStub as any,
      } as IData,
      client: {
        accessTokenTTL: 3600 * 24,
        refreshTokenTTL: 3600 * 24,
        refreshTokenLength: 20,
        name: 'test-name',
        clientId: 'test-id',
      } as IClient,
      user: null,
      done: (f, s, t) => ({f, s, t}),
      scope: null,
      isImplicitGrant: isImplicit,
    };
    return options;
  }

  it('if implicit grant then options.done is call with 2 params', () => {
    const options = createOptions(true);
    const result = createToken(options);
    expect(result.f).toBeNull();
    expect(result.s).not.toBeNull();
    expect(result.t).toBeUndefined();
  });

  it('if not implicit grant then options.done is call with 3 params', () => {
    const options = createOptions(false);
    const result = createToken(options);
    expect(result.f).toBeNull();
    expect(result.s).not.toBeNull();
    expect(result.t).not.toBeNull();
  });

});
