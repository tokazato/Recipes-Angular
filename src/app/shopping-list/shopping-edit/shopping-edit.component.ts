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

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) takeform: NgForm;
  subscription: Subscription;
  editmode = false;
  editIndex: number;
  editItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slService.editIngred.subscribe(
      (index: number) => {
        this.editIndex = index;
        this.editmode = true;
        this.editItem = this.slService.getingredient(index);
        this.takeform.setValue({
          name: this.editItem.name,
          amount: this.editItem.amount
        })
      }
    )
  }

  onAddItem(form: NgForm) {
    const value = form.value
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editmode){
      this.slService.upradeingridient(this.editIndex, newIngredient)
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editmode = false;
    form.reset()
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onClear() {
    this.takeform.reset()
    this.editmode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editIndex);
    this.onClear();
  }

}
