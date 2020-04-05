import { AbcResponse } from '../shared/AbcResponse';

class Ctrl {
// simple endpoint
  getAbc = (req, res) => {
  	const response: AbcResponse = {
  		field1: 'abc',
  		field2: 'definitely',
  	};

  	console.log(`User: ${req.username}`)

    return res.status(200).json(response);
  }


}

export default Ctrl;