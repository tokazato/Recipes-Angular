import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as authActions from './auth/store/auth.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor( 
    private authServ: AuthService,
    private store: Store<fromApp.appState> ) {}

  ngOnInit() {
    // this.authServ.autoLogin()
    this.store.dispatch(new authActions.AutoLogin())
  }
  
}
