import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Meal } from '../../../shared/meal.model';
import { EMPTY, Observable, of } from 'rxjs';
import { MealService } from '../../../shared/meal.service';
import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MealResolverService implements Resolve<Meal> {
  constructor(
    private mealService: MealService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Meal> | Observable<never> {
    const mealId = route.params['id'];
    return this.mealService.fetchMeal(mealId).pipe(mergeMap(meal => {
      if (meal) {
        return of(meal);
      }
      void this.router.navigate(['/']);
      return EMPTY;
    }))

  }
}
