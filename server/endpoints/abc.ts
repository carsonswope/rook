import { AbcResponse } from '../../shared/AbcResponse';

class Ctrl {
// simple endpoint
  getAbc =  async (req, res) => {
  	const response: AbcResponse = {
  		field1: 'abc',
  		field2: 'definitely',
  	};
    return res.status(200).json(response);
  }
}

export default Ctrl;