import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import * as fromApp from '../store/app.reducer';

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

    constructor( 
        private store: Store<fromApp.appState>) {}


    setLogoutTimer(_tokenExpirationDate: number) {
        this.tokenexpirationDate = setTimeout( () => {
            this.store.dispatch(new AuthActions.Logout());
        }, _tokenExpirationDate )
    }

    clearLogoutTimer() {
        if(this.tokenexpirationDate) {
            clearTimeout(this.tokenexpirationDate);
            this.tokenexpirationDate = null;
        }
    }

    

}