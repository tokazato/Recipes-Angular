import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as authAction from '../auth/store/auth.actions';
import * as recipeActions from '../recipes/store/recipe.actions';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy  {
  isAuthentication = false;
  private sub: Subscription;

  constructor( 
    private dataStorageService: DataStorageService,
    private authServ: AuthService,
    private router: Router,
    private store: Store<fromApp.appState>) {}


  ngOnInit() {
    this.sub = this.store
    .select('auth')   
    .pipe( map(authState => authState.user )
    ).subscribe(param => {
      this.isAuthentication = !!param;
    })
  }
 
  onSaveData() {
    // this.dataStorageService.storeRecipes();
    this.store.dispatch(new recipeActions.StoreRecipes())
  }

  onFetchData() {
    // this.dataStorageService.fetchRecipes().subscribe()
    this.store.dispatch(new recipeActions.FetchRecipes())
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  onLogout() {
    this.store.dispatch(new authAction.Logout())
  }





}
