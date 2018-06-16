declare module 'oauth2orize' {

  interface IServer {
    grant: IGrant;
  }

  interface IGrant {
    code: (client: any, redirectURI: any, user: any, ares: any, done: any) => any;
  }

  export const grant: any;
  export const utils: any;
  export const exchange: any;

  export function createServer(options?: any): any;
  export function errorHandler();
}

