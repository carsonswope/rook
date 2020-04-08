import { Component, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { AbcResponse } from '../../../server/shared/AbcResponse';

import { MatchesService } from '../services/matches.service'
import { GamesService } from '../services/games.service'
import { UsernameService } from '../services/username.service'
import { Match, GameState, Move } from '../../../server/shared/CoreGame';

import { timer } from 'rxjs/observable/timer';
import { concatMap, map, tap } from 'rxjs/operators';
import { Observable} from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'match-component',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss', '../card/card.component.scss']
})
export class MatchComponent implements OnDestroy {

  matchId: string;
  match: Match;
  userId: string;
  selectedCard: number;
  games: GameState[] = [];
  discardCards: number[]; //only used during the discard stage!
  smushCards: Boolean;
  yourCurrentBid: number = 0;
  pollInterval = 1000; // poll every 1 second!
  pollTimerSubscription: Subscription; // handle to the 'subscription', so we can cancel when we want

  constructor(
      private matchesService: MatchesService,
      private gamesService: GamesService,
      private usernameService: UsernameService,
      private activatedRoute: ActivatedRoute) {

    this.userId = this.usernameService.getUsername();
    this.matchId = this.activatedRoute.snapshot.params.matchId;
	this.selectedCard = -1;
    this.smushCards = false;

    const fetchCall = forkJoin(this.matchesService.get(this.matchId), this.gamesService.getAllForMatch(this.matchId));

    this.pollTimerSubscription = 
      timer(0, this.pollInterval)
          .pipe(concatMap(_ => fetchCall))
          .subscribe((out) => {
            this.match = out[0];
            this.games = out[1]
          }, (e) => {
            console.log('error');
            console.log(e);
          })
  }

  playerIndex(): number {
      return this.match.players.indexOf(this.userId);
  }
  
  ngOnDestroy() /*override :)*/ {
    this.pollTimerSubscription.unsubscribe();
  }

  isPlayer(): boolean {
    return this.match && this.match.players.includes(this.userId);
  }

  isOwner(): boolean {
    return this.isPlayer() && this.match.players[0] == this.userId;
  }
  
  getPlayerName(num: number): string {
      return this.match.players[(this.playerIndex()+num)%4];
  }
  
  getPlayerInfo(num: number): string {
      const playerName = this.getPlayerName(num);
      const relativeNumber=(this.playerIndex()+num)%4;
      if (this.whoseTurn()==playerName){
          if (this.getGameStage()==1){
              return "BIDDING";
          }
      }
      if (this.getGameStage()==1){
          if (this.games[this.games.length-1].passed.includes(relativeNumber)){
              return "PASSED";
          }
          if (this.games[this.games.length-1].currentWinningPlayer==relativeNumber){
              return this.games[this.games.length-1].currentBid.toString();
          }
      }
      return "";
  }
  
  whoseTurn(): string {
      return this.match.players[this.games[this.games.length-1].currentTurn];
  }
  
  getGameStage(): number {
      return this.games[this.games.length-1].gameStage;
  }
  
  getBidText(): string {
      return this.match.players[this.games[this.games.length-1].currentWinningPlayer]
      + " bid "
      + this.games[this.games.length-1].currentBid.toString();
  }
  
  increaseBid() {
      this.yourCurrentBid+=5;
      this.getYourCurrentBid();
  }
  
  move(mv: Move){
      this.matchesService.move(this.matchId, this.match.gameIds[this.match.gameIds.length-1], mv).subscribe((m: Match) => {
      this.match = m;
    }, (e) => {
      console.log('error!');
      console.log(e);
    })
  }
  
  bid() {
      var move: Move = new Move();
      move.moveType=1; //BID
      move.bid=this.yourCurrentBid;
      this.move(move);
  }
  
  pass() {
      var move: Move = new Move();
      move.moveType=1; //BID
      move.bid=0;
      this.move(move);
  }
  
  decreaseBid() {
      this.yourCurrentBid-=5;
      this.getYourCurrentBid();
  }
  
  getYourCurrentBid(): number {
      if (this.getGameStage()==1){
          if (this.yourCurrentBid%5 != 0) this.yourCurrentBid-=this.yourCurrentBid%5;
          if (this.yourCurrentBid<=this.games[this.games.length-1].currentBid){
              this.yourCurrentBid = this.games[this.games.length-1].currentBid + 5;
          }
          if (this.yourCurrentBid > 200) this.yourCurrentBid = 200;
      }
      return this.yourCurrentBid;
  }

  startMatch() {
    this.matchesService.start(this.matchId).subscribe((m: Match) => {
      this.match = m;
    }, (e) => {
      console.log('error!');
      console.log(e);
    })
  }
  getHandRelative(num: number): number[] {
     return this.games[this.games.length-1].hands[(this.playerIndex()+num)%4];
  }
  getHand(): number[] {
	 return this.games[this.games.length-1].hands[this.playerIndex()];
  }
  
  select(card){
     if (this.getGameStage()==2){
         if (this.discardCards.includes(card)){
             this.discardCards.splice(this.discardCards.indexOf(card),1);
         }
         else {
             if (this.discardCards.length < 5){
                 if (!this.discardCards.includes(card)){
                     this.discardCards.push(card);
                 }
             }
         }
     }
     else if (this.getGameStage()==3){
         if (card == this.selectedCard) {
             this.selectedCard = -1;
         }
         else {
             this.selectedCard = card;
         }
     }
  }
  
}
