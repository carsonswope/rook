import { Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { UsernameService } from '../services/username.service';
import { RandomnameResponse } from '../../../server/shared/RandomnameResponse';


@Component({
  selector: 'username-widget',
  templateUrl: './username.component.html',
  // styleUrls: ['./username.component.scss']
})
export class UsernameComponent {

  enteringNewUsername = false;
  newUsername = '';

  constructor(private usernameService: UsernameService) {
  }

  getUsername() {
  	return this.usernameService.getUsername();
  }

  submitNewUsername() {
  	this.usernameService.setUsername(this.newUsername);
  	this.newUsername = '';
  	this.enteringNewUsername = false;
  }

}
