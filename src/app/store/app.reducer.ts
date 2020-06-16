import { ActionReducerMap } from '@ngrx/store';

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipes from '../recipes/store/recipe.reducer';

export interface appState {
    shoppingList: fromShoppingList.state,
    auth: fromAuth.State,
    recipes: fromRecipes.State
}

export const appReducer: ActionReducerMap<appState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.RecipeReducer
}