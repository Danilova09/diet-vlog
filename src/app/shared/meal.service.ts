import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Meal } from './meal.model';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  meals: Meal[] = [];
  mealsChange = new Subject<Meal[]>();
  fetchingMealsChange = new Subject<boolean>();
  totalCaloriesChange = new Subject<number>();
  mealsMainUrl = 'https://diet-vlog-default-rtdb.firebaseio.com/meals.json';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  getMeals() {
    return this.meals.slice();
  }

  sortArrayByDate() {
    this.meals.sort((a, b) => {
      return <any>new Date(b.date) - <any>new Date(a.date);
    })
  }

  getTotalCalories() {
    const currentDate = new Date().toISOString().slice(0, 10);
    let sum = 0;
    this.meals.filter((meal) => {
      if (meal.date === currentDate) {
        sum += meal.calories;
      }
    })
    return sum;
  }

  fetchMeals() {
    this.fetchingMealsChange.next(true);
    this.http.get<{ [id: string]: Meal }>(this.mealsMainUrl).pipe(
      map(result => {
        if (!result) {
          this.fetchingMealsChange.next(false);
          return [];
        }
        return Object.keys(result).map(id => {
          this.fetchingMealsChange.next(false);
          const mealData = result[id];
          return new Meal(id, mealData.description, mealData.calories, mealData.mealTime, mealData.date);
        })
      })).subscribe(meals => {
      this.meals = meals;
      this.sortArrayByDate();
      this.mealsChange.next(this.meals);
      this.totalCaloriesChange.next(this.getTotalCalories());
    }, () => {
      this.fetchingMealsChange.next(false);
    });
  }

  removeMeal(meal: Meal) {
    return this.http.delete(`https://diet-vlog-default-rtdb.firebaseio.com/meals/${meal.id}.json`);
  }

  addMeal(meal: Meal) {
    const body = {
      description: meal.description,
      calories: meal.calories,
      mealTime: meal.mealTime,
      date: meal.date,
    }
    return this.http.post(this.mealsMainUrl, body).pipe(
      tap((result) => {
        this.fetchMeals();
        void this.router.navigate(['/']);
      }));
  }

  editMeal(meal: Meal) {
    const body = {
      description: meal.description,
      calories: meal.calories,
      mealTime: meal.mealTime,
      date: meal.date,
    }
    return this.http.put(`https://diet-vlog-default-rtdb.firebaseio.com/meals/${meal.id}.json`, body);
  }

  fetchMeal(mealId: string) {
    return this.http.get<Meal>(`https://diet-vlog-default-rtdb.firebaseio.com/meals/${mealId}.json`).pipe(
      map((result) => {
        if (!result) {
          return null;
        }
        return new Meal(mealId, result.description, result.calories, result.mealTime, result.date);
      }));
  }
}
