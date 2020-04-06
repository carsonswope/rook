import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'

import { Game } from '../../../server/shared/CoreGame'

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class GamesService {

    // copy constructor. Call this to have access to member functions, which don't get
    // copied over the wire
    static copy(g: Game): Game {
      let gNew = new Game();
      gNew.id = g.id;
      return gNew;
    }

    constructor(private http: HttpClient) {}

    getAllForMatch(matchId: string): Observable<Game[]> {
      return this.http
          .get<Game[]>('/api/match/' + matchId +'/games', {observe: 'response'})
          .pipe(map((gs: HttpResponse<Game[]>) => gs.body.map(g => GamesService.copy(g))));
    }

}
