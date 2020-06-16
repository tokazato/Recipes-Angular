import { Actions, ofType, Effect } from '@ngrx/effects';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router';

import * as AuthActions from './auth.actions';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface authResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuth = (email: string, id: string, token: string, expireDate: number) => {
    const expiradtionDate = new Date(
        new Date().getTime() + expireDate * 100
    );
    const user = new User(email, id, token, expiradtionDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthSuccess({
            email: email,
            id: id,
            token: token,
            expireDate: expiradtionDate,
            redirect: true
        })
}

const handleError = (errorRes) => {
    let errorMessage = 'unknown message';
    if( !errorRes.error || !errorRes.error.error ) {
        return of(new AuthActions.AuthFail(errorMessage))
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS' : 
        errorMessage = 'this email exists already ';
        break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'this email does not exist';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'this password is incorrect';
            break;
    }
    return of(new AuthActions.AuthFail(errorMessage))
}

@Injectable()
export class AuthEffects {

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap( (signupAction: AuthActions.SignupStart) => {
            return this.http.post<authResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBS43EWRCKN6x4LdUXhaTwNMdVSDyceVlo',
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe (
                tap( (resData) => {
                    this.authServ.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                 }),
                catchError( errorRes => {
                    return handleError(errorRes);
                })
            )
        })
    )


    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap( (authData: AuthActions.LoginStart) => {
            return this.http
            .post<authResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBS43EWRCKN6x4LdUXhaTwNMdVSDyceVlo', 
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe (
                tap( (resData) => {
                    this.authServ.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuth(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
                 }),
                 catchError( errorRes => {
                    return handleError(errorRes);
                })
            )
        })
    );

    @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),
    tap((authSuccessAction: AuthActions.AuthSuccess) => {
      if (authSuccessAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map( () => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData'))
            if(!userData) {
                return {type: 'DUMMY'};
            }
            const loadedUser = new User(
                userData.email, 
                userData.id, 
                userData._token, 
                new Date(userData._tokenExpirationDate)
                )
    
            if( loadedUser.token ) {
                const expirationDate = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authServ.setLogoutTimer(expirationDate)
                return new AuthActions.AuthSuccess({
                    email: loadedUser.email,
                    id: loadedUser.id,
                    token: loadedUser.token,
                    expireDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                })
                // this.autoLogout(expirationDate)
            }
            return {type: 'DUMMY'}
        })
    );

    @Effect({dispatch: false})
    autoLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap( () => {
            localStorage.removeItem('userData');
            this.authServ.clearLogoutTimer()
            this.router.navigate(['/auth'])
        })
    );

    

    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authServ: AuthService) {}    
}