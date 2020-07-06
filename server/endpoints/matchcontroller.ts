import { RookDatabase } from '../database';
import { Match, GAME_STAGE } from '../shared/CoreGame';
import getRandomComplaint from '../complaints';

class MatchController {

  constructor(private d: RookDatabase) {}

  // returns all matches that a user is playing in
  getAll = (req, res) => {
    return res.status(200).json(this.d.getMatchesForPlayer(req.username));
  }

  get = (req, res) => {
  	// const matchId = req.params.matchId
  	const m = this.d.getMatch(req.params.matchId)
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

  	// fortunately this appears to be a reference! we can just mutate it and it is changed in the 'DB'
  	const m = this.d.getMatch(matchId);
  	if (!m) {
  		return res.sendStatus(404);
  	}
  	if (m.players[seatId] || m.players.includes(username)) {
  		return res.sendStatus(400);
  	}

  	m.players[seatId] = username;

  	return res.status(200).json(m);
  }

  // starts game in match (first or otherwise)
  start = (req, res) => {
    // note that this isn't type safe at all right now. We could create a shared MatchCreateRequestPayload... but fuck it
    const matchId = req.body.matchId;
    const username: string = req.username;

    const m = this.d.getMatch(matchId);
    if (!m) {
      return res.sendStatus(404);
    }
    const dealerId = m.gameIds.length % 4;
    if (m.players[dealerId] != username) {
      return res.sendStatus(403);
    }
    if (!m.allPlayersJoined()) {
      console.log('not all players joined!');
      return res.sendStatus(400);
    }
    if (m.gameIds.length) {
      const lastGameId = m.gameIds[m.gameIds.length - 1];
      const g = this.d.games.get(lastGameId);
      const gs = g.getGameState(0, false);
      if (gs.gameStage != GAME_STAGE.DONE) {
        console.log('must finish previous game before starting new one')
        return res.sendStatus(400);
      }
    }
    // start match == create first game of match. dealer for first match is player 0
    const g = this.d.createGame(m.gameIds.length);
    m.gameIds.push(g.id);

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

  chat = (req, res) => {


	  const matchId: string = req.body.matchId;
	  const username: string = req.username;

	  const m = this.d.getMatchForPlayer(matchId, username);
	  if (!m) {
		  return res.sendStatus(404, `no match named ${matchId} for player ${username}`);
	  }

	  const message = req.body.message || getRandomComplaint();

	  if (!message) {
		  return res.sendStatus(400, 'Must either specify random complaint or custom message');
	  }

	  m.chatMessages.push({
		  timestamp: +new Date(),
		  message: message,
		  player: username,
	  });

	  return res.status(200).json({});
  }

}

export default MatchController;