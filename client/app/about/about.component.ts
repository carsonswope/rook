import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { AbcResponse } from '../../../server/shared/AbcResponse';
import { RandomnameResponse } from '../../../server/shared/RandomnameResponse';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {

  text: string = 'waiting response';
  text1: string = 'response 2';
  name: string = '...';
  httpStatus: number = 0;

  constructor(private http: HttpClient) {

  	this.http.get<AbcResponse>('/api/abc', {observe: 'response'})
  		.subscribe((r: HttpResponse<AbcResponse>) => {
  		this.text = r.body.field1;
  		this.text1 = r.body.field2;
  		this.httpStatus = r.status;
		
  	});
    this.http.get<RandomnameResponse>('/api/randomname', {observe: 'response'})
        .subscribe((r: HttpResponse<RandomnameResponse>) => {
        this.name = r.body.name;
        this.httpStatus = r.status;
    });
  }

}
