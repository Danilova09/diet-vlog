import { Component, Input, OnInit } from '@angular/core';
import { Meal } from '../../../shared/meal.model';
import { MealService } from '../../../shared/meal.service';
import { mergeMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MealResolverService } from './meal-resolver.service';

@Component({
  selector: 'app-meal-item',
  templateUrl: './meal-item.component.html',
  styleUrls: ['./meal-item.component.css']
})
export class MealItemComponent implements OnInit {
  @Input() meal!: Meal;
  isRemoving = false;
  isEdit = true;

  constructor(
    private mealService: MealService,
    private router: Router,
    private resolver: MealResolverService,
    private route: ActivatedRoute,
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

  onEdit() {
    void this.router.navigate([`meals/${this.meal.id}/edit`]);
  }
}
