import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Meal } from '../../../shared/meal.model';
import { MealService } from '../../../shared/meal.service';

@Component({
  selector: 'app-meal-item',
  templateUrl: './meal-item.component.html',
  styleUrls: ['./meal-item.component.css']
})
export class MealItemComponent {
  @Input() meal!: Meal;
  isRemoving = false;

  constructor(
    private mealService: MealService,
    private router: Router,
  ) { }

  onRemove() {
    this.isRemoving = true;
    this.mealService.removeMeal(this.meal).pipe(tap(result => {
      this.isRemoving = false;
      this.mealService.fetchMeals();
    }, () => {
      this.isRemoving = false;
    })).subscribe();
  }

  onEdit() {
    void this.router.navigate([`meals/${this.meal.id}/edit`]);
  }

}
