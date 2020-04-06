// https://www.npmjs.com/package/uuid
import { v4 as getUUID } from 'uuid';

export class Match {
	id: string = '';
	players: string[] = [null, null, null, null];

	// ids of games that have been part of the match.
	// in the order in which they occured
	gameIds: string[] = [];

	started(): boolean {
		return this.gameIds.length > 0;
	}

	readyToStart(): boolean {
		return !this.started() && this.players.every(p => p != null);
	}


}


export class Game {
	constructor() {
		this.id = getUUID();
	}

	id: string = '';

	//getScore(): number[] {
	//	return [0, 0];
	//}

	// this is a server-side function
	// getGameView(playerId: number /* 0-3 */ ) {  }
}