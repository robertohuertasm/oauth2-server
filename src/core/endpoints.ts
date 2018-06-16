import * as passport from 'passport';
import * as login from 'connect-ensure-login';
import * as code from '../grants/code';
import { introspection } from './introspection';

export function buildEndPoints(server, data) {
  return {
    index: (req, res) => {
      res.render('index');
    },
    loginForm: (req, res) => {
      res.render('login');
    },
    login: [
      passport.authenticate('local', {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
      }),
    ],
    logout: (req, res) => {
      req.logout();
      res.redirect('/');
    },
    authorization: [
      login.ensureLoggedIn(),
      server.authorization(code.authorization(data)),
      code.authorizationRender(data),
    ],
    decision: [login.ensureLoggedIn(), server.decision()],
    token: [
      passport.authenticate(['passport-oauth2-strategy'], { session: false }),
      server.token(),
      server.errorHandler(),
    ],
    introspection: [
      passport.authenticate(['passport-token-introspection'], {
        session: false,
        assignProperty: 'rs',
      }),
      introspection(data),
      server.errorHandler(),
    ],
  };
}
