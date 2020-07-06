import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatchesService } from '../services/matches.service'
import { Match } from '../../../server/shared/CoreGame';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  newMatchName: string = '';
  joinMatchName: string = '';
  joiningMatch: Match = null;

  currentMatches: Match[] = [];

  constructor(private matchesService: MatchesService, private router: Router) {
    this.fetchMatches();
  }


  fetchMatches() {
    this.matchesService.getAll().subscribe((ms: Match[] ) => {
      this.currentMatches = ms;
    });
  }

  createNewMatch() {
    this.matchesService.create(this.newMatchName).subscribe((m: Match) => {
      this.router.navigate(['/match/' + m.id]);
    });
  }

  startJoinMatch() {
    this.matchesService.get(this.joinMatchName).subscribe((m: Match) => {
      this.joiningMatch = m;
    });   
  }
  
  quitMatch(matchId: string) {
    this.matchesService.quit(matchId).subscribe((m: Match) => {
      this.currentMatches.splice(this.currentMatches.indexOf(m));
    });
  }

  joinMatch(seatId: number) {
    this.matchesService.join(this.joinMatchName, seatId).subscribe((m: Match) => {
      this.router.navigate(['/match/' + m.id]);
    });
  }

  getActivePlayers(m: Match): string[] {
    return m.players.filter(p => p);
  }

}
