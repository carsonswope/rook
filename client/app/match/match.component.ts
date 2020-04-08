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
  //only used during the discard stage!
  discardCards: number[] = []; 
  trumpChoice: number = 0;
  
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
  
  getTrumpChoice(): string{
      return ['Green','Red','Yellow','Black'][this.trumpChoice];
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
          if (this.getGameStage()==2){
              return "DISCARDING";
          }
          if (this.getGameStage()==3){
              return "THINKING";
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
	  const final_move : Move = mv;
      this.matchesService.move(this.matchId, this.match.gameIds[this.match.gameIds.length-1], final_move).subscribe((gs: GameState) => {
        this.games[this.games.length - 1] = gs;
      //this.match = m;
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
    });
  }
  getHandRelative(num: number): number[] {
     return this.games[this.games.length-1].hands[(this.playerIndex()+num)%4];
  }
  
  getHand(): number[] {
      if (this.getGameStage()==2 && this.whoseTurn()==this.userId && this.games[this.games.length-1].bidTaker==this.playerIndex()){
          const hand = this.games[this.games.length-1].hands[this.playerIndex()].concat(this.games[this.games.length-1].kitty);
          return hand.filter(card => !this.discardCards.includes(card)).sort((a, b) => a - b);
      }
      var hand = this.games[this.games.length-1].hands[this.playerIndex()].slice();
      if (this.selectedCard != -1) {
          var index = hand.indexOf(this.selectedCard);
          hand.splice(index,1);
      }
	  return hand;
  }
  
  getDiscards(): number[] {
      const tempDiscards = this.discardCards.slice();
      while(tempDiscards.length < 5){
          tempDiscards.push(-2);
      }
      return tempDiscards;
  }
  
  getTrump(): string {
      return ['Green','Red','Yellow','Black'][this.games[this.games.length-1].trump];
  }
  
    getCurrentTrick(): number[] {
        return this.games[this.games.length-1].currentTrick;
    }
    
  getCurrentTrickLeader(): number {
      return (this.games[this.games.length-1].currentTrickLeader + 4 - this.playerIndex())%4;
  }
  
  compareCards(card0 : number, card1 : number, trump : number, suit : number) : number{
      if (card0==56) return 0; //ROOK
      if (card1==56) return 1;
      const card0_suit = Math.floor(card0/14);
      const card1_suit = Math.floor(card1/14);
      const card0_val = card0%14 + ((card0_suit==suit) ? 14 : 0) + ((card0_suit==trump) ? 28 : 0);
      const card1_val = card0%14 + ((card1_suit==suit) ? 14 : 0) + ((card1_suit==trump) ? 28 : 0);
      return (card0 > card1) ? 0 : 1;
  }
  
  getCurrentWinner(): number {
      if (this.games[this.games.length-1].currentTrick.length==0) return -1;
      var winner : number = 0;
      const suit = Math.floor(this.games[this.games.length-1].currentTrick[0]/14);
      for (var i : number = 1; i < this.games[this.games.length-1].currentTrick.length; i++){
          if (this.compareCards(this.games[this.games.length-1].currentTrick[winner],
          this.games[this.games.length-1].currentTrick[i],
          this.games[this.games.length-1].trump,
          suit)==1) winner = i;
      }
      return winner;
  }
  
  cycleTrumpChoice(){
      this.trumpChoice = (this.trumpChoice + 1)%4;
  }
  
  discard(){
      if (this.discardCards.length!=5) return;
      var move: Move = new Move();
      move.moveType=2; //DISCARD
      move.discarded = this.discardCards.slice();
      move.trump=this.trumpChoice;
      this.move(move);
  }
  
  playCard(){
      if (this.selectedCard==-1) return;
      var move: Move = new Move();
      move.moveType=3;
      move.card=this.selectedCard;
      this.move(move);
      this.selectedCard=-1;
  }
  
  getSelectedCard() : number{
      return this.selectedCard;
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
         console.log(this.discardCards);
     }
     else if (this.getGameStage()==3){
         //we have to click twice, angular isn't updated the card for some reason
         if (this.selectedCard != -1) this.selectedCard = -1;
         else this.selectedCard = card;
         /*this.selectedCard = card;*/
     }
  }

  readyToStartMatch(): boolean {
    return this.match.allPlayersJoined() && this.match.gameIds.length == 0;
  }
  
}
