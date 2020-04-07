import { Component, OnDestroy } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { AbcResponse } from '../../../server/shared/AbcResponse';

import { MatchesService } from '../services/matches.service'
import { GamesService } from '../services/games.service'
import { UsernameService } from '../services/username.service'
import { Match, GameState } from '../../../server/shared/CoreGame';

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

  ngOnDestroy() /*override :)*/ {
    this.pollTimerSubscription.unsubscribe();
  }

  isPlayer(): boolean {
    return this.match && this.match.players.includes(this.userId);
  }

  isOwner(): boolean {
    return this.isPlayer() && this.match.players[0] == this.userId;
  }

  startMatch() {
    this.matchesService.start(this.matchId).subscribe((m: Match) => {
      this.match = m;
    }, (e) => {
      console.log('error!');
      console.log(e);
    })
  }
  
  getHand(): number[] {
	 return [0,3,12,15,16,25,27,28,43,49,50,51,56];
  }
  
  select(card){
	 if (card == this.selectedCard) {
		 this.selectedCard = -1;
	 }
	 else {
		 this.selectedCard = card;
	 }
  }
  
}
