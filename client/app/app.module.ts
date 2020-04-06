// Angular
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Services
import { UsernameService } from './services/username.service';
import { MatchesService } from './services/matches.service';
import { GamesService } from './services/games.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UsernameComponent } from './username/username.component';
import { MatchComponent } from './match/match.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UsernameComponent,
    MatchComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    UsernameService,
    MatchesService,
    GamesService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
