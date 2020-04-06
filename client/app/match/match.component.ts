import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { AbcResponse } from '../../../server/shared/AbcResponse';

import { MatchesService } from '../services/matches.service'
import { UsernameService } from '../services/username.service'
import { Match } from '../../../server/shared/CoreGame';


@Component({
  selector: 'match-component',
  templateUrl: './match.component.html',
  // styleUrls: ['./home.component.scss']
})
export class MatchComponent {

  matchId: string;
  match: Match;
  userId: string;

  constructor(
      private matchesService: MatchesService,
      private usernameService: UsernameService,
      private activatedRoute: ActivatedRoute) {

    this.userId = this.usernameService.getUsername();
    this.matchId = this.activatedRoute.snapshot.params.matchId;
    this.matchesService.get(this.matchId).subscribe((m: Match) => {
      this.match = m;
    })
  }

  matchObserver(): boolean {
    return this.match && !this.match.players.includes(this.userId)
  }

  matchPlayer(): boolean {
    return this.match && this.match.players.includes(this.userId);
  }



}
