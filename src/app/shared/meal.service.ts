import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Meal } from './meal.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  meals: Meal[] = [];
  mealsChange = new Subject<Meal[]>();
  fetchingMealsChange = new Subject<boolean>();
  totalCaloriesChange = new Subject<number>();
  removingChange = new Subject<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
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
      if (!result) {
        this.fetchingMealsChange.next(false);
        return [];
      }
      return Object.keys(result).map(id => {
        this.fetchingMealsChange.next(false);
        const mealData = result[id];
        return new Meal(id, mealData.description, mealData.calories, mealData.mealTime);
      })
    })).subscribe(meals => {
      this.meals = meals;
      this.mealsChange.next(meals);
      this.totalCaloriesChange.next(this.getTotalCalories());
    }, () => {
      this.fetchingMealsChange.next(false);
    });
  }

  removeMeal(meal: Meal) {
    return  this.http.delete(`https://diet-vlog-default-rtdb.firebaseio.com/meals/${meal.id}.json`);
  }

  addMeal(meal: Meal) {
    const body = {
      description: meal.description,
      calories: meal.calories,
      mealTime: meal.mealTime,
    }
    return this.http.post('https://diet-vlog-default-rtdb.firebaseio.com/meals.json', body).pipe(
      tap( (result) => {
        this.fetchMeals();
        void this.router.navigate(['/']);
      }));
  }

  editMeal(meal: Meal) {
    const body = {
      description: meal.description,
      calories: meal.calories,
      mealTime: meal.mealTime,
    }
    return this.http.put(`https://diet-vlog-default-rtdb.firebaseio.com/meals/${meal.id}.json`, body).pipe(
      tap((result
      ) => {
        this.fetchMeals();
      }));
  }

  fetchMeal(mealId: string) {
    return this.http.get<Meal>(`https://diet-vlog-default-rtdb.firebaseio.com/meals/${mealId}.json`).pipe(
      map((result) => {
        if (!result) {
          return null;
        }
        return new Meal(mealId, result.description, result.calories, result.mealTime);
      }));
  }

}
