import { Injectable } from '@angular/core';


import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListAction from '../shopping-list/store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  newRecipe: Recipe;
  changedRecipes = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'Tasty Schnitzel',
    //   'A super-tasty Schnitzel - just awesome!',
    //   'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
    //   [
    //     new Ingredient('Meat', 1),
    //     new Ingredient('French Fries', 20)
    //   ]),
    // new Recipe('Big Fat Burger',
    //   'What else you need to say?',
    //   'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    //   [
    //     new Ingredient('Buns', 2),
    //     new Ingredient('Meat', 1)
    //   ])
  ];

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromApp.appState>
    ) {}

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipe: Recipe[]) {
    this.recipes = recipe;
    this.changedRecipes.next(this.recipes.slice());
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListAction.AddIngredients(ingredients))
  }
     
  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.changedRecipes.next(this.recipes.slice());
  }

  addNewRecipes(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.changedRecipes.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1)
    this.changedRecipes.next(this.recipes.slice());
  }
  
}
