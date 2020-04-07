import * as express from 'express';

import Ctrl from './endpoints/abc';
import Randomname from './endpoints/randomname';
import MatchController from './endpoints/matchcontroller';
import GameController from './endpoints/gamecontroller';

import { USERNAME_COOKIE } from './shared/Constants';

import { RookDatabase } from './database';

// read username from cookie and write to request context
function getUsernameFromCookie(req, res, next) {
    const c = 
        (req.headers.cookie || '').split(';')
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

  const db = new RookDatabase();

  const ctrl = new Ctrl();
  const randomname = new Randomname();

  const matchCtrl = new MatchController(db);
  const gameCtrl = new GameController(db);

  router.route('/matches').get(verifyUsername, matchCtrl.getAll);
  router.route('/matches').post(verifyUsername, matchCtrl.create);
  router.route('/join_match').post(verifyUsername, matchCtrl.join);
  router.route('/quit_match').post(verifyUsername, matchCtrl.quit);
  router.route('/start_match').post(verifyUsername, matchCtrl.start);

  router.route('/match/:matchId').get(verifyUsername, matchCtrl.get);
  router.route('/match/:matchId/games').get(verifyUsername, gameCtrl.getAll);

  router.route('/game/move').post(verifyUsername, gameCtrl.playMove);

  router.route('/abc').get(verifyUsername, ctrl.getAbc);
  router.route('/randomname').get(randomname.getRandomname);

  app.use('/api', getUsernameFromCookie)

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

  console.log('Routes set');


}

export default setRoutes;
