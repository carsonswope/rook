import { Match, Game } from './shared/CoreGame'

export class RookDatabase {
	matches: Match[] = [];

	games: Map<string, Game> = new Map();

	// silly reproductions of what a relational DB might do.
	// if this gets too out of hand maybe look at sqlite?
	getMatch(id: string): Match {
		return this.matches.find(m => m.id == id) || null;
	}

	getMatchesForPlayer(playerId: string): Match[] {
		return this.matches.filter(m => m.players.find(p => p == playerId) != null);
	}

	getMatchForPlayer(id: string, playerId: string): Match {
		const m = this.getMatch(id);
		if (m.players.find(p => p == playerId) != null) {
			return m;
		}
		return null;
	}

	createMatch(id: string, playerId: string): Match {
		// not duplicate-proof!
		let m = new Match();
		m.id = id;
		m.players[0] = playerId;
		this.matches.push(m);
		return m;
	}

	deleteMatch(id: string): Boolean {
		const m = this.getMatch(id);
		if (!m){
			return false;
		}
		const i = this.matches.indexOf(m);
		this.matches.splice(i,1);
		return true;
	}

	// gameId: 0-indexed, which number game in the match is it
	createGame(gameId: number): Game {
		const g = new Game();
		g.dealer = gameId % 4;
		this.games.set(g.id, g);
		return g;
	}
}
