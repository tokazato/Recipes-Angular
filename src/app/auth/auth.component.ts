import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService,authResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html' 
})
export class AuthComponent {
   isLoginMode = true;
   isLoading = false;
   error: string = null;

   constructor( 
       private authService: AuthService,
       private router: Router) {}
   
   onSwitchMode() {
       this.isLoginMode = !this.isLoginMode;
   }

   onSubmited(form: NgForm) {
       if( !form.value) {
           return;
       }

       const email = form.value.email;
       const pass = form.value.password;

       let authObs: Observable<authResponseData>;

       this.isLoading = true;

       if(this.isLoginMode) {
        authObs = this.authService.singIn(email, pass)
       } else {
        authObs = this.authService.signup(email, pass)
       }

       authObs.subscribe(response => {
            console.log(response)
            this.isLoading = false;
            this.router.navigate(['/recipes'])
        }, errorRes => {
            console.log(errorRes)
            this.error = errorRes;
            this.isLoading = false;
        }
        );
       
       form.reset()
   }


}