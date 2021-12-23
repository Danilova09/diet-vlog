import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../../../shared/meal.model';
import { MealService } from '../../../shared/meal.service';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-meal-item',
  templateUrl: './meal-item.component.html',
  styleUrls: ['./meal-item.component.css']
})
export class MealItemComponent implements OnInit {
  @Input() meal!: Meal;
  isRemoving = false;

  constructor(
    private mealService: MealService,
  ) { }

  ngOnInit(): void {
    this.mealService.removingChange.subscribe((isRemoving: boolean) => {
      this.isRemoving = isRemoving;
    })
  }

  onRemove() {
    this.isRemoving = true;
    this.mealService.removeMeal(this.meal).pipe(tap(result => {
      this.isRemoving = false;
      this.mealService.fetchMeals();
    }, () => {
      this.isRemoving = false;
    })).subscribe();
  }

}
