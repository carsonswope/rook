import * as express from 'express';

import Ctrl from './endpoints/abc';


function setRoutes(app) {
  const router = express.Router();

  const ctrl = new Ctrl()

  router.route('/abc').get(ctrl.getAbc);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}

export default setRoutes;
