import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

export interface State {
    recipes: Recipe[]
}

const initialState: State = {
    recipes: []
} 

export function RecipeReducer(state = initialState, action: RecipesActions.RecipesActions) {
    switch(action.type) {
        case RecipesActions.SET_RECIPE:
            return {
                ...state,
                recipes: [...action.payload]
            };
        case RecipesActions.ADD_RECIPES:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }
        case RecipesActions.UPDATE_RECIPES:
            const updateRecipe = {
                ...state.recipes[action.payload.index],
                ...action.payload.newRecipe                
            }
            const updateRecipes = [...state.recipes];
            updateRecipes[action.payload.index] = updateRecipe
            return {
                ...state,
                recipes: updateRecipes
            }
        case RecipesActions.DELETE_RECIPES:
            return {
                ...state,
                recipes: state.recipes.filter( ( recipe, index ) => {
                    return index !== action.payload
                })
            }
        default:
            return state
    }
}