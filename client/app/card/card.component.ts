import { Component, Input } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
// import { AbcResponse } from '../../../server/shared/AbcResponse';

@Component({
  selector: 'card-component',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input('cardId') cardId: number;
  @Input('hidden') hidden: Boolean;
  @Input('selected') selected: Boolean;
  cardVal: string;
  cardColor: string;
  
  

  constructor() {
	this.hidden = false;
	this.cardVal = 'N/A';
	this.cardColor = 'N/A';
	this.selected = false;
  }
  
  ngOnInit() {
	const colors = ['green','red','black','yellow','rook'];
	this.cardColor = colors[Math.floor(this.cardId / 14)];
	this.cardVal = (this.cardColor === 'rook') ? 'ROOK' : ((this.cardId+1) % 14 + 1).toString(); 
  }
}
