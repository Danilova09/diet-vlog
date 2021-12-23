import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Meal } from './meal.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MealService {
  meals: Meal[] = [];
  mealsChange = new Subject<Meal[]>();
  fetchingMealsChange = new Subject<boolean>();
  totalCaloriesChange = new Subject<number>();

  constructor(
    private http: HttpClient,
  ) {
  }

  getMeals() {
    return this.meals.slice();
  }

  getTotalCalories() {
    return this.meals.reduce((sum, meal) => sum + meal.calories, 0);
  }

  fetchMeals() {
    this.fetchingMealsChange.next(true);
    this.http.get<{ [id: string]: Meal }>('https://diet-vlog-default-rtdb.firebaseio.com/meals.json').pipe(map(result => {
      return Object.keys(result).map(id => {
        this.fetchingMealsChange.next(false);
        const mealData = result[id];
        return new Meal(id, mealData.description, mealData.calories, mealData.mealTime);
      })
    })).subscribe(meals => {
      this.meals = meals;
      this.mealsChange.next(meals);
      this.totalCaloriesChange.next(this.getTotalCalories());
    });
  }


}
