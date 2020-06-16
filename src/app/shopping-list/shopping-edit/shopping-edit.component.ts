import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) takeform: NgForm;
  subscription: Subscription;
  editmode = false;
  editItem: Ingredient;

  constructor(
    private slService: ShoppingListService,
    private store: Store<fromApp.appState>
    ) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1) {
        this.editmode = true;
        this.editItem = stateData.editedIngredient;
        this.takeform.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        })
      } else {
        this.editmode = false
      }
    })
    // this.subscription = this.slService.editIngred.subscribe(
    //   (index: number) => {
    //     this.editIndex = index;
    //     this.editmode = true;
    //     this.editItem = this.slService.getingredient(index);
    //     this.takeform.setValue({
    //       name: this.editItem.name,
    //       amount: this.editItem.amount
    //     })
    //   }
    // )
  }

  onAddItem(form: NgForm) {
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editmode){
      // this.slService.upradeingridient(this.editIndex, newIngredient)
      this.store.dispatch(new ShoppingListActions.UpdateIngredients(newIngredient))
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.editmode = false;
    form.reset()
    
  }

 

  onClear() {
    this.takeform.reset()
    this.editmode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

  onDelete() {
    // this.slService.deleteIngredient(this.editIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredients())
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit())
  }

}
