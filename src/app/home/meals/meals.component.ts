import { Component, OnDestroy, OnInit } from '@angular/core';
import { MealService } from '../../shared/meal.service';
import { Meal } from '../../shared/meal.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit, OnDestroy {
  meals: Meal[] = [];
  totalCalories = 0;
  isFetchingMeals = false;
  mealsSubscription!: Subscription;
  fetchingMealsSubscription!: Subscription;
  totalCaloriesSubscription!: Subscription;

  constructor(
    private mealService: MealService,
  ) { }

  ngOnInit(): void {
    this.meals = this.mealService.getMeals();
    this.mealsSubscription = this.mealService.mealsChange.subscribe((meals: Meal[]) => {
      this.meals = meals;
    });
    this.fetchingMealsSubscription = this.mealService.fetchingMealsChange.subscribe((isFetching: boolean) => {
      this.isFetchingMeals = isFetching;
    });
    this.totalCaloriesSubscription = this.mealService.totalCaloriesChange.subscribe((totalCalories: number) => {
      this.totalCalories = totalCalories;
    });
    this.mealService.fetchMeals();
  }

  ngOnDestroy() {
    this.mealsSubscription.unsubscribe();
    this.fetchingMealsSubscription.unsubscribe();
    this.totalCaloriesSubscription.unsubscribe();
  }
}
