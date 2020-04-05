import { RandomnameResponse } from '../shared/RandomnameResponse';

class Randomname {
// simple endpoint
  getRandomname =  async (req, res) => {
  	const response: RandomnameResponse = {
  		name: "player" + (Math.random() * 100000).toFixed(0).toString(),
  	};
    return res.status(200).json(response);
  }
}

export default Randomname;