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
	score: number[] = [0, 0];

	hand: number[];

	// populated if game state < done
	currentTurn: number;

	// populated if game stage = bidding:
	currentBid: number = 0;
	currentWinningPlayer: number = 0;
	passed: number[] = [];

	// populated if game stage > bidding:
	bidTaker: number; // player ID
	finalBid: number; // how much the bid was for!

	// populated if game stage == bidding, & bidTaker == current user
	kitty: number[];

	isMoveValid(m: Move): boolean {

		if (m.playerId != this.currentTurn) {
			console.log('Not your turn!');
			return false;
		}

		if (this.gameStage == GAME_STAGE.BIDDING) {
			if (m.moveType != MOVE_TYPE.BID) {
				console.log('Expecting a bid!')
				return false;
			}
			if (m.bid % 5 != 0) {
				console.log('Bid must be multiple of 5');
				return false;
			}
			if (m.bid > 0 && m.bid <= this.currentBid) {
				console.log('Must beat current bid');
				return false;
			}
			if (m.bid == 0 && this.passed.length == 3) {
				console.log('everyone cant pass!')
				return false;
			}
		}

		return true;
	}

	getNextBidder(): number {
		let t = (this.currentTurn + 1) % 4;
		this.currentTurn++;
		while (this.passed.indexOf(t) > -1) {
			t++;
		}
		return t;
	}

	playMove(m: Move): boolean {
		if (!this.isMoveValid(m)) {
			console.log('move labeled as invalid!');
			return false;
		}

		if (m.moveType == MOVE_TYPE.BID) {
			if (m.bid == 0) {
				// Pass!
				this.passed.push(m.playerId);
				if (this.passed.length == 3) {
					// 3 players have passed! 
					this.gameStage = GAME_STAGE.DISCARDING;
					this.finalBid = this.currentBid;
					this.bidTaker = this.currentWinningPlayer;
					this.currentTurn = this.currentWinningPlayer;
				} else {
					this.currentTurn = this.getNextBidder();
				}
			} else {
				// bid greater than previous
				this.currentBid = m.bid;
				this.currentWinningPlayer = m.playerId;
				this.currentTurn = this.getNextBidder();
			}
		}


		return true;
	}

	// rest of it (current trick) to fill in later
}

enum MOVE_TYPE {
	BID = 1, // bid
	DISCARD = 2,
	PLAY = 3
}


export class Move {
	// who is playing the move! this is calculated on the server,
	// not part of a move payload from the user
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

	getGameState(playerId: number): GameState {
		let gs = new GameState();
		gs.gameStage = GAME_STAGE.BIDDING;
		gs.currentTurn = this.dealer + 1;

		this.moves.forEach(m => {
			gs.playMove(m);
			// make sure move is valid? or don't bother at this point?
		})

		return gs;
	}

	//validMove()

	// this is a server-side function
	// getGameView(playerId: number /* 0-3 */ ) {  }
}