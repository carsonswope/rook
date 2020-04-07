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
  points: number;
  
  

  constructor() {
	this.hidden = true;
	this.cardVal = 'N/A';
	this.cardColor = 'N/A';
	this.selected = false;
    this.points = 0;
  }
  
  ngOnInit() {
    this.hidden = (this.cardId == -1);
    if (this.hidden) return;
	const colors = ['green','red','black','yellow','rook'];
	this.cardColor = colors[Math.floor(this.cardId / 14)];
	this.cardVal = (this.cardColor === 'rook') ? 'ROOK' : ((this.cardId+1) % 14 + 1).toString(); 
    if (this.cardVal=='ROOK') this.points = 20;
    if (this.cardVal=='1') this.points = 15;
    if (this.cardVal=='14' || this.cardVal=='10') this.points = 10;
    if (this.cardVal=='5') this.points = 5;
    
  }
}
