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
    console.log(req.body.matchId);
    const match = this.d.getMatch(req.body.matchId);
    if (!match) {
      return res.sendStatus(404);
    }
    const gameId = req.body.gameId;
    if (!match.gameIds.includes(gameId)) {
      return res.sendStatus(404);
    }
    const playerId = match.players.indexOf(req.username);
    if (playerId == -1) {
      return res.sendStatus(403);
    }

    const game = this.d.games.get(gameId);
    if (!game) {
      return res.sendStatus(404);
    }

    let gameState = game.getGameState(playerId, false);
    console.log(req.body.move);
    // const move: Move = JSON.parse(req.body.move);
    const move: Move = req.body.move;

    move.playerId = playerId;

    if (!gameState.isMoveValid(move)) {
      return res.sendStatus(400);
    }

    game.moves.push(move);
    gameState = game.getGameState(playerId);

    return res.status(200).json(gameState);

  }


}

export default GameController;