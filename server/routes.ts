import * as express from 'express';

import Ctrl from './endpoints/abc';
import Randomname from './endpoints/randomname';

import { USERNAME_COOKIE } from './shared/Constants'

// read username from cookie and write to request context
function getUsernameFromCookie(req, res, next) {
    const c = 
        req.headers.cookie.split(';')
            .map(c => c.trim())
            .find(c => c.startsWith(USERNAME_COOKIE))
    if (c) {
      const username = c.split('=')[1]
      req.username = username;
    }
    next();
}

// reject request if username is missing
function verifyUsername(req, res, next) {
  if (!req.username) {
    res.sendStatus(401);
  } else {
    next();
  }
}

function setRoutes(app) {
  const router = express.Router();

  const ctrl = new Ctrl();
  const randomname = new Randomname();

  router.route('/abc').get(verifyUsername, ctrl.getAbc);
  router.route('/randomname').get(randomname.getRandomname);

  app.use('/api', getUsernameFromCookie)

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

  console.log('Routes set');


}

export default setRoutes;
