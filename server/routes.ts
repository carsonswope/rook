import * as express from 'express';

import Ctrl from './endpoints/abc';
import Randomname from './endpoints/randomname';

function setRoutes(app) {
  const router = express.Router();

  const ctrl = new Ctrl();
  const randomname = new Randomname();

  router.route('/abc').get(ctrl.getAbc);
  router.route('/randomname').get(randomname.getRandomname);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}

export default setRoutes;
