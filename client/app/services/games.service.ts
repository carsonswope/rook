import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'

import { GameState } from '../../../server/shared/CoreGame'

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GamesService {

    // copy constructor. Call this to have access to member functions, which don't get
    // copied over the wire
    //static copy(g: GameState): GameState {
    //  let gNew = new GameState();
    //  gNew.id = g.id;
    //  return gNew;
    //}

    constructor(private http: HttpClient) {}

    getAllForMatch(matchId: string): Observable<GameState[]> {
      return this.http
          .get<GameState[]>('/api/match/' + matchId +'/games', {observe: 'response'})
          .pipe(map((gs: HttpResponse<GameState[]>) => gs.body.map(g => g)));
    }

}
