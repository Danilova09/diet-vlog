import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Meal } from './meal.model';
import { Subject } from 'rxjs';
import { error } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  meals: Meal[] = [];
  mealsChange = new Subject<Meal[]>();
  fetchingMealsChange = new Subject<boolean>();

  constructor(
    private http: HttpClient,
  ) {
  }

  getMeals() {
    return this.meals.slice();
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
    });
  }

}
