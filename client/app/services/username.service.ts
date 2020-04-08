import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { DOCUMENT } from '@angular/common';

import { Observable } from 'rxjs';

import { RandomnameResponse } from '../../../server/shared/RandomnameResponse';
import { USERNAME_COOKIE } from '../../../server/shared/Constants'

@Injectable()
export class UsernameService {

    constructor(
        // asking for the HttpClient in the constructor like this
        // will cause it to be automatically 'injected' on initialization
        private http: HttpClient,
        // we *could* access the 'document' object without injection, but
        // injection lets us use a dummy if we were going to write unit tests
        // (not that that's going to happen)
        // ALso, this is funny syntax that won't be used for much else
        @Inject(DOCUMENT) private d: Document) {

      // When this service is initialized, check for username in cookies. If not preset, fetch random name
      // from server
      if (!this.getUsername()) {
        this.http
            .get<RandomnameResponse>('/api/randomname', {observe: 'response'})
            .subscribe((r: HttpResponse<RandomnameResponse>) => { this.setUsername(r.body.name); });
      }
    }

    // This shouldn't exist, correct? Only can pick new name?
    // clearUsername() {
      // this.d.cookie = USERNAME_COOKIE + '=;expires=' + new Date().toUTCString() + ';path=/';
    // }

    setUsername(c: string) {
      this.d.cookie = USERNAME_COOKIE + '=' + c + '; path=/';
    }

    getUsername(): string {
      let cookie_val = '';
      this.d.cookie.split(';').map(c => c.trim()).map(c => {
        let p = c.split('=');
        if (p[0] == USERNAME_COOKIE) {
          cookie_val =p[1]
        }
      })
      return cookie_val;
    }

}
