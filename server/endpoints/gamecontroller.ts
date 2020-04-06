import { RookDatabase } from '../database';

class GameController {

  constructor(private d: RookDatabase) {}

  // returns all games for a given match

  getAll = (req, res) => {
    const m = this.d.getMatch(req.params.matchId)
    if (!m) {
      return res.sendStatus(404)
    }

    let playerId = m.players.indexOf(req.username)
    const games = m.gameIds.map((gameId: string) => this.d.games.get(gameId).getGameState(playerId));

    // for games 0 to (last-1), return a summary?
    // for last/current game, return more info!
    // will need to do some filtering here, so that opponents cards are hidden from player, for example!


    console.log(this.d.games)
    console.log(games)


    return res.status(200).json(games);
  }


}

export default GameController;