import { Component, OnInit } from '@angular/core';
import { MealService } from '../../shared/meal.service';
import { Meal } from '../../shared/meal.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  meals: Meal[] = [];
  isFetchingMeals = false;
  totalCalories = 0;
  mealsSubscription!: Subscription;
  fetchingMealsSubscription!: Subscription;
  totalCaloriesSubscription!: Subscription;

  constructor(
    private mealService: MealService,
  ) { }

  ngOnInit(): void {
    this.meals = this.mealService.getMeals();
    this.totalCalories = this.mealService.getTotalCalories();
    this.mealsSubscription = this.mealService.mealsChange.subscribe((meals: Meal[]) => {
      this.meals = meals;
    })
    this.totalCaloriesSubscription = this.mealService.totalCaloriesChange.subscribe((totalCalories: number) => {
      this.totalCalories = totalCalories;
    })
    this.fetchingMealsSubscription =  this.mealService.fetchingMealsChange.subscribe((isFetching: boolean) => {
      this.isFetchingMeals= isFetching;
    })
    this.mealService.fetchMeals();
  }


  ngOnDestroy() {
    this.mealsSubscription.unsubscribe();
    this.fetchingMealsSubscription.unsubscribe();
    this.totalCaloriesSubscription.unsubscribe();
  }

}
