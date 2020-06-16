import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService,authResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as authActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html' 
})
export class AuthComponent implements OnInit {
   isLoginMode = true;
   isLoading = false;
   error: string = null;

   constructor( 
       private authService: AuthService,
       private router: Router,
       private store: Store<fromApp.appState>) {}
   
   onSwitchMode() {
       this.isLoginMode = !this.isLoginMode;
   }

   ngOnInit () {
    this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
    })
   }

   onSubmited(form: NgForm) {
       if( !form.value) {
           return;
       }

       const email = form.value.email;
       const pass = form.value.password;


       if(this.isLoginMode) {
        // authObs = this.authService.singIn(email, pass)
        this.store.dispatch(
            new authActions.LoginStart({
                email: email,
                password: pass
            })
        )
       } else {
        // authObs = this.authService.signup(email, pass)
        this.store.dispatch(
            new authActions.SignupStart({
                email: email,
                password: pass
            })
        )
       }

       
       form.reset()
   }


}