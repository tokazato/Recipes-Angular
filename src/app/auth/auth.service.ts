import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface authResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    private tokenexpirationDate: any;

    user = new BehaviorSubject<User>(null);

    constructor( 
        private http: HttpClient,
        private router: Router) {}

    signup(email: string, password: string) {
        return this.http.post<authResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBS43EWRCKN6x4LdUXhaTwNMdVSDyceVlo',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe( 
            catchError(this.handleError), 
            tap(param => {
            this.handleAuthentication(
                param.email, 
                param.localId, 
                param.idToken, 
                +param.expiresIn
                );
            })
        );
    }

    singIn(email: string, password: string ) {
        return this.http
        .post<authResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBS43EWRCKN6x4LdUXhaTwNMdVSDyceVlo', 
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
            )
            .pipe( catchError(this.handleError), 
            tap(param => {
                this.handleAuthentication(
                    param.email, 
                    param.localId, 
                    param.idToken, 
                    +param.expiresIn
                    )
            })
        );
        
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'))
        if(!userData) {
            return;
        }
        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
            )

        if( loadedUser.token ) {
            this.user.next(loadedUser)
            const expirationDate = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDate)
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenexpirationDate) {
            clearTimeout(this.tokenexpirationDate);
        }
        this.tokenexpirationDate = null;
    }

    autoLogout(_tokenExpirationDate: number) {
        this.tokenexpirationDate = setTimeout( () => {
            this.logout();
        }, _tokenExpirationDate )
    }

    private handleAuthentication(
        email: string, 
        id: string, 
        token: string, 
        expire: number
        ) {
        const expireDate = new Date( new Date().getTime() + +expire * 100 );
        const user = new User( email, id, token, expireDate );
        this.user.next(user)
        this.autoLogout(expire * 1000)
        console.log(expire)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    private handleError(errorRes: HttpErrorResponse) {
            let errorMessage = 'unknown message';
            if( !errorRes.error || !errorRes.error.error ) {
                return throwError(errorMessage);
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
            return throwError(errorMessage);
        
    }
}