import { Action } from '@ngrx/store';

export const LOGIN_START = '[Auth] Login Start';
export const AUTH_FAIL = '[Auth] Auth Fail';
export const AUTH_SUCCESS = '[Auth] Auth Success';
export const SIGNUP_START = '[Auth] Signup Start'
export const LOGOUT = '[Auth] Logout';
export const AUTO_LOGIN = '[Auth] Auto Login'

export class AuthSuccess implements Action {
    readonly type = AUTH_SUCCESS;

    constructor(public payload: {
        email: string;
        id: string;
        token: string;
        expireDate: Date;
        redirect: boolean;
    }) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class LoginStart implements Action {
    readonly type = LOGIN_START

    constructor( public payload: {email: string; password: string}) {}
}

export class AuthFail implements Action {
    readonly type = AUTH_FAIL;

    constructor ( public payload: string ) {}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor( public payload: {email: string; password: string}) {}
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}



export type authActions = AuthSuccess | Logout | LoginStart | AuthFail | SignupStart | AutoLogin;