import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { AbcResponse } from '../../../server/shared/AbcResponse';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  text: string = 'waiting response';
  text1: string = 'response 2';
  httpStatus: number = 0;

  constructor(private http: HttpClient) {

  	this.http.get<AbcResponse>('/api/abc', {observe: 'response'})
  		.subscribe((r: HttpResponse<AbcResponse>) => {
  		this.text = r.body.field1;
  		this.text1 = r.body.field2;
  		this.httpStatus = r.status;
  	});

  }

}
