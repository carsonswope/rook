import { RookDatabase } from '../database';
import { Move } from '../shared/CoreGame'

class GameController {

  constructor(private d: RookDatabase) {}

  // returns all games for a given match

  getAll = (req, res) => {
    const m = this.d.getMatch(req.params.matchId)
    if (!m) {
      return res.sendStatus(404)
    }

    let playerId = m.players.indexOf(req.username)
    const games = 
      m.gameIds.map((gameId: string) => this.d.games.get(gameId).getGameState(playerId));

    return res.status(200).json(games);
  }

  playMove = (req, res) => {

    console.log('play move!');
    // console.log(req.body.matchId);

    const match = this.d.getMatch(req.body.matchId);
    // console.log(match);
    if (!match) {
      return res.sendStatus(404);
    }
    const gameId = req.body.gameId;
    // console.log(gameId);
    if (!match.gameIds.includes(gameId)) {
      return res.sendStatus(404);
    }
    const playerId = match.players.indexOf(req.username);
    // console.log(playerId);
    if (playerId == -1) {
      return res.sendStatus(403);
    }

    const game = this.d.games.get(gameId);
    // console.log(game);
    if (!game) {
      return res.sendStatus(404);
    }
    const gameState = game.getGameState(playerId);
    const move: Move = req.body.move;
    move.playerId = playerId;

    if (!gameState.isMoveValid(move)) {
      return res.sendStatus(400);
    }

    // console.log(gameState);
    console.log(move);

    return res.status(200).json(true);


    //const playerId = match.
    //const game = this.d.games.get(req.params.gameId);
    //const gameState = game.getGameState()
    //const move: Move = req.params.move;




  }


}

export default GameController;