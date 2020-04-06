import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'

import { Match } from '../../../server/shared/CoreGame'

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MatchesService {

    constructor(private http: HttpClient) {}

    getAll(): Observable<Match[]> {
      return this.http
          .get<Match[]>('/api/matches', {observe: 'response'})
          .pipe(map((m: HttpResponse<Match[]>) => { return m.body }));
    }

    get(matchId: string): Observable<Match> {
      return this.http
          .get<Match>('/api/match/' + matchId, {observe: 'response'})
          .pipe(map((m: HttpResponse<Match>) => { return m.body }));
    }

    create(matchId: string): Observable<Match> {
      return this.http
          .post<Match>('/api/matches', {matchId: matchId}, {observe: 'response'})
          .pipe(map((m: HttpResponse<Match>) => { return m.body }));
    }

    join(matchId: string, seatId: number): Observable<Match> {
        return this.http
          .post<Match>('/api/join_match', {matchId: matchId, seatId: seatId}, {observe: 'response'})
          .pipe(map((m: HttpResponse<Match>) => { return m.body }));
    }
    


}
