import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators'

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root'})
export class DataStorageService {
    constructor( private http: HttpClient,
                 private recipeService: RecipeService,
                 private authService: AuthService ) {}

    storeRecipes() {
        const recipe = this.recipeService.getRecipes();
        this.http.put('https://ang-project2.firebaseio.com/recipe.json', recipe).subscribe(
            (respons: Response) => {
                console.log(respons)
            }
        )
    }
    fetchRecipes() {
        return this.http
        .get<Recipe[]>(
            'https://ang-project2.firebaseio.com/recipe.json'
        ).pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    return {
                        ...recipe, 
                        ingredients: recipe.ingredients ? recipe.ingredients : []
                    };
                });
            }),
            tap( recipes => {
                this.recipeService.setRecipes(recipes);
            })
        )
    }
}