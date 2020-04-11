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

	allPlayersJoined(): boolean {
		return this.players.every(p => p != null);
	}
}

export enum GAME_STAGE {
	BIDDING = 1,
	DISCARDING = 2,
	PLAYING = 3,
	DONE = 4
}

// Class that is seen in the client!
export class GameState {

	gameStage: GAME_STAGE = GAME_STAGE.BIDDING;
	score: number[] = [0, 0];

	// hands for all players! this must be filtered out before
	// returning to client
	hands: number[][];

	// populated if game state < done
	currentTurn: number;

	// populated if game stage = bidding:
	currentBid: number = 0;
	currentWinningPlayer: number = 0;
	passed: number[] = [];

	// populated if game stage > bidding:
	bidTaker: number; // player ID
	finalBid: number; // how much the bid was for!

	// populated only if game stage == bidding, & bidTaker == current user
	kitty: number[];

	// populated if game stage == playing!
	trump: number;
	currentTrickLeader: number;
	currentTrick: number[];

	lastTrickWinner: number;
	lastTrickLeader: number;
	lastTrick: number[] = [];

	tricksWon: number[][]; // 4 arrays containing tricks won by each player

	getSuit(c: number): number {
		return (c == 56) ? this.trump : Math.floor(c / 14)
	}

	getCardScore(c: number): number {
		if (c == 56) return 20; // rook
		const cLocal = c % 14;
		if (cLocal == 13) return 15; // 1
		if (cLocal == 12 || cLocal == 8) return 10; // 14, 10
		if (cLocal == 3) return 5; // 5
		return 0;
	}

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
		} else if (this.gameStage == GAME_STAGE.DISCARDING) {
            if (m.moveType != MOVE_TYPE.DISCARD) {
                console.log('Expecting a discard!');
                return false;
            }
            if (!(m.trump == 0 || m.trump == 1 || m.trump == 2 || m.trump == 3)) {
        		console.log('invalid trump');
        		return false;
            }
            if (m.discarded.length != 5 || !m.discarded.every(d => Number.isInteger(d))) {
            	console.log('must discard 5 cards, integers!');
            	// console.log(m.discarded)
            	return false
            }
            if ([...new Set(m.discarded)].length != 5) {
            	console.log('no duplicates!')
            	return false;
            }
            const discardable = new Set([...this.hands[m.playerId], ...this.kitty]);
            if (!m.discarded.every(d => discardable.has(d))) {
				console.log(discardable);
            	console.log('only discard available cards!');
            	return false;
            }
        }  else if (this.gameStage == GAME_STAGE.PLAYING) {
        	if (m.moveType != MOVE_TYPE.PLAY) { 
        		console.log('Expecting a card play');
        		return false;
        	}
    		if (!this.hands[m.playerId].includes(m.card)) {
    			console.log('must have card to play it!');
    			return false;
    		}
    		// if currentTrick is empty (leader!), player can play any card they want.
    		// otherwise, they have to follow suit if they can!
    		if (this.currentTrick.length > 0) {
    			const leadCard = this.currentTrick[0];
    			const leadSuit = this.getSuit(leadCard);
    			const playedSuit = this.getSuit(m.card);
    			if (leadSuit != playedSuit &&
    				 !this.hands[m.playerId].every(c => this.getSuit(c) != leadSuit)) {
    				console.log('must be out of suit to not follow suit!');
    				return false;
    			}
    			//console.log('')
    		}

		} else if (this.gameStage == GAME_STAGE.DONE) {
			console.log('no moves available when game is done!');
			return false;
		}

		return true;
	}

	getNextBidder(): number {
		let t = (this.currentTurn + 1) % 4;
		this.currentTurn++;
		while (this.passed.indexOf(t) > -1) {
			t++;
			t = t % 4;
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

					delete this.currentBid;
					delete this.currentWinningPlayer;
					delete this.passed;
				} else {
					this.currentTurn = this.getNextBidder();
				}
			} else {
				// bid greater than previous
				this.currentBid = m.bid;
				this.currentWinningPlayer = m.playerId;
				this.currentTurn = this.getNextBidder();
			}
		} else if (m.moveType == MOVE_TYPE.DISCARD) {
			// don't need to change currentTurn: it will be still the same person's turn
			// to play the first card!
			this.trump = m.trump;

			const cards = new Set([...this.hands[m.playerId], ...this.kitty]);
			m.discarded.forEach(d => cards.delete(d))

			// why do we need to overload the sort operator here? not really sure
			this.hands[m.playerId] = [...cards].sort((a, b) => a - b);

			this.gameStage = GAME_STAGE.PLAYING;
			this.kitty = m.discarded.slice(); // copy, now kitty holds the discarded cards!

			this.currentTrick = [];
			this.currentTrickLeader = m.playerId;
			this.tricksWon = [[], [], [], []];

		} else if (m.moveType == MOVE_TYPE.PLAY) {

			this.currentTrick.push(m.card);

			const cardIdx = this.hands[m.playerId].indexOf(m.card);
			this.hands[m.playerId].splice(cardIdx, 1);

			if (this.currentTrick.length == 4) {

				// leader of this trick is 1 person after the last player to play on the trick,
				// currentTrick is indexed against whoever played the first card
				const leadPlayer = (m.playerId + 1) % 4;
				this.lastTrick = this.currentTrick.slice();
				this.lastTrickLeader = leadPlayer;

				const rookIdx = this.currentTrick.indexOf(56);
				if (rookIdx > -1) {
					const winningPlayer = (leadPlayer + rookIdx) % 4;

					this.lastTrickWinner = winningPlayer;
					this.currentTrick.forEach(c => this.tricksWon[winningPlayer].push(c));
					this.currentTrick = [];
					this.currentTrickLeader = winningPlayer;
					this.currentTurn = winningPlayer;

				} else {

					const trickHasTrump = 
						this.currentTrick.findIndex(c => this.getSuit(c) == this.trump) > -1;
					let winningSuit = trickHasTrump ? this.trump : this.getSuit(this.currentTrick[0]);
					let winningCard = -1;
					let winningPlayer = -1;

					this.currentTrick.forEach((c, i) => {
						if (this.getSuit(c) == winningSuit) {
							if (c > winningCard) {
								winningCard = c;
								winningPlayer = (leadPlayer + i) % 4;
							}
						}						
					});

					if (winningPlayer == -1) {
						console.log('internal server error! poop stink!')
					}

					this.lastTrickWinner = winningPlayer;
					this.currentTrick.forEach(c => this.tricksWon[winningPlayer].push(c));
					this.currentTrick = [];
					this.currentTrickLeader = winningPlayer;
					this.currentTurn = winningPlayer;
				}

				// The game is over!!
				if (!this.hands[0].length) {
					// The game is concluded!
					console.log('game over!!');
					console.log(this.tricksWon)
					// per-player scores
					const scores = 
						this.tricksWon.map(tricks =>
							tricks.map(c => this.getCardScore(c))
								.reduce((t, i) => t + i, 0));

					let scoreTeam1 = scores[0] + scores[2];
					let scoreTeam2 = scores[1] + scores[3];
					
					const kittyScore = this.kitty.reduce((t, c) => t + this.getCardScore(c), 0);
					if (this.lastTrickWinner == 0 || this.lastTrickWinner == 2) {
						scoreTeam1 += kittyScore + 20;
					} else {
						scoreTeam2 += kittyScore + 20;
					}
					
					// make sure they made their bid!
					if (this.bidTaker == 0 || this.bidTaker == 2) {
						if (scoreTeam1 < this.finalBid) {
							scoreTeam1 = -this.finalBid;
						}
					} else {
						if (scoreTeam2 < this.finalBid) {
							scoreTeam2 = -this.finalBid;
						}
					}

					

					this.score = [scoreTeam1, scoreTeam2];
					this.gameStage = GAME_STAGE.DONE;
				}

			} else {
				this.currentTurn = (this.currentTurn + 1) % 4;
			}
		}

		return true;
	}
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

// https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
const shuffle = (a: number[]) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


export class Game {
	constructor() {
		this.id = getUUID();

		const deck = 
			// make sure it's very shuffled :)
			shuffle(shuffle(shuffle(Array.from(Array(57).keys()))));

		this.startingHands = [
			deck.slice(0, 13).sort((a, b) => a - b),
			deck.slice(13, 26).sort((a, b) => a - b),
			deck.slice(26, 39).sort((a, b) => a - b),
			deck.slice(39, 52).sort((a, b) => a - b),
		];
		// blasphemy to put the kitty all at the end like that
		this.startingKitty = deck.slice(52).sort((a, b) => a - b);

		/*
		// smaller hands for faster e2e testing, if desired
		this.startingHands = [
			deck.slice(0, 2).sort((a, b) => a - b),
			deck.slice(2, 4).sort((a, b) => a - b),
			deck.slice(4, 6).sort((a, b) => a - b),
			deck.slice(6, 8).sort((a, b) => a - b),
		];
		// blasphemy to put the kitty all at the end like that
		this.startingKitty = deck.slice(10, 15).sort((a, b) => a - b);
		*/
	}

	id: string = '';
	dealer: number;

	moves: Move[] = [];

	// players 0-3
	startingHands: number[][];
	//
	startingKitty: number[];

	getGameState(playerId: number, filter: boolean = true): GameState {
		let gs = new GameState();
		gs.gameStage = GAME_STAGE.BIDDING;
		gs.currentTurn = (this.dealer + 1)%4;
		// make copy!
		gs.hands = [
			this.startingHands[0].slice(),
			this.startingHands[1].slice(),
			this.startingHands[2].slice(),
			this.startingHands[3].slice(),
		];
		gs.kitty = this.startingKitty.slice();

		// play through game, updating gamestate
		this.moves.forEach(m => gs.playMove(m));

		if (filter) {
			// filter hand before returning to client!
			for (let i =0; i < 4; i++) {
				if (playerId != i) {
					gs.hands[i] = gs.hands[i].map(_ => -1);
				}
			}

			// why is this typecast necessary?
			if (gs.gameStage as number == GAME_STAGE.DISCARDING && playerId == gs.bidTaker) {
				console.log('show the kitty!')
			} else {
				gs.kitty = [-1, -1, -1, -1, -1];
			}
		}

		return gs;
	}
}
