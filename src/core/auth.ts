import * as passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { Strategy as oauth2Strategy } from 'passport-oauth2-strategy';
import { Strategy as introspectionStrategy } from 'passport-token-introspection';
import * as data from '../db';
import { IUser } from '../db/interfaces';

passport.use(new localStrategy(
  (username, password, done) => {
    data.UserModel.findOne({ username, password })
      .then((user: IUser) => {
        if (!user) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      })
      .catch(err => { if (err) { return done(err); } });
  },
));

passport.use(new oauth2Strategy(
  { passReqToCallBack: true },
  (req, clientId, clientSecret, done) => {
    const grant = req.body['grant_type'];
    data.ClientModel.findByClientId(clientId)
      .then(client => {
        if (!client) { return done(null, false); } // 401
        if (grant === 'authorization_code') {
          if (client.clientSecret !== clientSecret) {
            return done(null, false);
          }
        }
        return done(null, client);
      })
      .catch(err => { if (err) { return done(err); } });
  },
));

passport.use(new introspectionStrategy(
  (id, secret, done) => {
    data.ResourceServerModel.findOneBy('id', id)
      .then(rs => {
        if (!rs || rs.secret !== secret) { return done(null, false); } // 401
        return done(null, rs);
      })
      .catch(err => { if (err) { return done(err); } });
  },
));
