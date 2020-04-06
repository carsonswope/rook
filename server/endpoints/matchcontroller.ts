// import { RandomnameResponse } from '../shared/RandomnameResponse';
//import 
import { RookDatabase } from '../database';
import { Match } from '../shared/CoreGame';

class MatchController {

  constructor(private d: RookDatabase) {}

  // returns all matches that a user is playing in
  getAll = (req, res) => {
    return res.status(200).json(this.d.getMatchesForPlayer(req.username));
  }

  get = (req, res) => {
  	// const matchId = req.params.matchId
  	const m = this.d.getMatch(req.params.matchId)
  	console.log(this.d);
  	if (!m) {
  		return res.sendStatus(404)
  	}
  	return res.status(200).json(m)
  }

  create = (req, res) => {
  	// note that this isn't type safe at all right now. We could create a shared MatchCreateRequestPayload... but fuck it
  	const matchId = req.body.matchId;

  	if (this.d.getMatch(matchId)) {
  		return res.sendStatus(409);
  	}

  	return res.status(200).json(this.d.createMatch(matchId, req.username));
  }


  join = (req, res) => {
  	const matchId: string = req.body.matchId;
  	const seatId: number = req.body.seatId;
  	const username: string = req.username;

  	console.log(seatId);
  	console.log(this.d.matches[0].players)

  	// fortunately this appears to be a reference! we can just mutate it and it is changed in the 'DB'
  	const m = this.d.getMatch(matchId);
  	if (!m) {
  		return res.sendStatus(404);
  	}
  	if (m.players[seatId] || m.players.includes(username)) {
  		return res.sendStatus(400);
  	}

  	m.players[seatId] = username;

  	console.log('joined!!');
  	console.log(this.d.matches[0].players)


  	return res.status(200).json(m);

  }
  
  quit = (req, res) => {
	const matchId: string = req.body.matchId;
  	const username: string = req.username;

  	// fortunately this appears to be a reference! we can just mutate it and it is changed in the 'DB'
  	const m = this.d.getMatch(matchId);
	if (!m) {
		console.log('no match with matchId ')
		console.log(matchId);
		return res.sendStatus(404);
	}
	if (!m.players.includes(username)) {
		return res.sendStatus(400);
	}
	
	console.log('removing ' + username + ' from ' + matchId);
	var another_player = false; //if there is another player, we don't need to delete the match afterward
	for (var seatId = 0; seatId < 4; seatId++){
		if (m.players[seatId] == username){
			m.players[seatId] = null;
		}
		else if (m.players[seatId] != null){
			another_player = true;
		}
	}
	if (!another_player){
		this.d.deleteMatch(matchId);
	}
	
	return res.status(200).json(m);
  }

}

export default MatchController;