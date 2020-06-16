import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import * as fromApp from '../../store/app.reducer';
import { tap, switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';


@Injectable()
export class RecipeEffects {
    @Effect()
    fetcheRecipes = this.action$.pipe(
        ofType(RecipeActions.FETCH_RECIPES),
        switchMap( () => {
            return this.http
            .get<Recipe[]>(
                'https://ang-project2.firebaseio.com/recipe.json'
            )
        }),
        map(recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe, 
                    ingredients: recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return new RecipeActions.SetRecipes(recipes)
        })
    )

    @Effect({dispatch: false})
    StoreRecipes = this.action$.pipe(
        ofType(RecipeActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap( ([actionData, recipesState]) => {
            return this.http.put('https://ang-project2.firebaseio.com/recipe.json', recipesState.recipes)
        })
    )

    constructor( private action$: Actions, private http: HttpClient, private store: Store<fromApp.appState> ) {}
}