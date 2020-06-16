import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Recipe } from './recipe.model'; 
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as RecipeActions from './store/recipe.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(
        private dataStorageServices: DataStorageService,
        private store: Store<fromApp.appState>,
        private actions$: Actions
        ) {}

    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            // return this.dataStorageServices.fetchRecipes();
            return this.store.select('recipes').pipe(
              take(1),
              map(recipesState => {
                return recipesState.recipes
              }),
              switchMap(recipes => {
                if(recipes.length === 0) {
                  this.store.dispatch(new RecipeActions.FetchRecipes());
                  return this.actions$.pipe(
                      ofType(RecipeActions.SET_RECIPE),
                      take(1)
                  );
                } else {
                  return of(recipes);
                }
              })
            )
    }

}

