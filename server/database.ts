import { Match } from './shared/CoreGame'

export class RookDatabase {
	matches: Match[] = [];

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
		m.started = false;
		this.matches.push(m);
		return m;
	}


}
