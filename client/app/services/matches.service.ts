import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'

import { Match, Move } from '../../../server/shared/CoreGame'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MatchesService {

    // copy constructor. Call this to have access to member functions, which don't get
    // copied over the wire
    static copy(m: Match): Match {
      let mNew = new Match();
      mNew.id = m.id;
      mNew.players = m.players;
      mNew.gameIds = m.gameIds;
      return mNew;
    }

    constructor(private http: HttpClient) {}

    getAll(): Observable<Match[]> {
      return this.http
          .get<Match[]>('/api/matches', {observe: 'response'})
          .pipe(map((ms: HttpResponse<Match[]>) => { return ms.body.map(m => MatchesService.copy(m)); }));
    }

    get(matchId: string): Observable<Match> {
      return this.http
          .get<Match>('/api/match/' + matchId, {observe: 'response'})
          .pipe(map((m: HttpResponse<Match>) => { return MatchesService.copy(m.body); }));
    }

    create(matchId: string): Observable<Match> {
      return this.http
          .post<Match>('/api/matches', {matchId: matchId}, {observe: 'response'})
          .pipe(map((m: HttpResponse<Match>) => { return MatchesService.copy(m.body); }));
    }

    join(matchId: string, seatId: number): Observable<Match> {
        return this.http
          .post<Match>('/api/join_match', {matchId: matchId, seatId: seatId}, {observe: 'response'})
          .pipe(map((m: HttpResponse<Match>) => { return MatchesService.copy(m.body); }));
    }

    start(matchId: string): Observable<Match> {
        return this.http
          .post<Match>('/api/start_match', {matchId: matchId}, {observe: 'response'})
          .pipe(map((m: HttpResponse<Match>) => { return MatchesService.copy(m.body); }));
    }
    
	quit(matchId: string): Observable<Match> {
		return this.http
		  .post<Match>('/api/quit_match', {matchId: matchId}, {observe: 'response'})
		  .pipe(map((m: HttpResponse<Match>) => {return m.body }));
	}
    
    move(matchId: string, gameId: string, move: Move): Observable<Match> {
        return this.http
          .post<Match>('/api/game/move', {matchId: matchId, gameId: gameId, move: move}, {observe: 'response'})
		  .pipe(map((m: HttpResponse<Match>) => {return m.body }));
    }

}
