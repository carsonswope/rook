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


enum GAME_STAGE {
	BIDDING = 1,
	DISCARDING = 2,
	PLAYING = 3,
	DONE = 4
}

// Class that is seen in the client!
export class GameState {

	gameStage: GAME_STAGE = GAME_STAGE.BIDDING;

	// populated if game state < done
	currentTurn: number;

	// populated if game stage = bidding:
	currentBid: number = 0;
	passed: number[] = [];

	// populated if game stage > bidding:
	bidTaker: number; // player ID
	finalBid: number; // how much the bid was for!

	// populated if game stage == bidding, & bidTaker == current user
	kitty: number[];

}

enum MOVE_TYPE {
	BID = 1, // bid
	DISCARD = 2,
	PLAY = 3
}

export class Move {
	// who is playing the move!
	playerId: number;
	moveType: MOVE_TYPE;

	// if bid:
	bid: number; // 0 == pass, >0 == bid

	// if discard:
	discarded: number[]; // 5 cards to discard
	trump: number; // 0-3 trump suit

	// if play:
	card: number; // card played!
}

export class Game {
	constructor() {
		this.id = getUUID();
	}

	id: string = '';
	dealer: number;

	moves: Move[] = [];

	//playMove()

	getGameState(playerId: number): GameState {
		// initialize GameState..
		let gs = new GameState();
		gs.gameStage = GAME_STAGE.BIDDING;
		gs.currentTurn = this.dealer + 1;

		this.moves.forEach(m => {

		})

		return gs;
	}

	//validMove()

	// this is a server-side function
	// getGameView(playerId: number /* 0-3 */ ) {  }
}