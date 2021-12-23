import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Meal } from '../shared/meal.model';
import { MealService } from '../shared/meal.service';

@Component({
  selector: 'app-new-meal',
  templateUrl: './new-meal.component.html',
  styleUrls: ['./new-meal.component.css']
})
export class NewMealComponent implements OnInit {
  @ViewChild('mealForm') mealForm!: NgForm;

  constructor(
    private mealService: MealService,
  ) {
  }

  ngOnInit(): void {
  }

  onCreate() {
    this.mealForm.value.description;
    this.mealForm.value.mealTime;
    this.mealForm.value.calories;

    const meal = new Meal(
      'id',
      this.mealForm.value.description,
      this.mealForm.value.calories,
      this.mealForm.value.mealTime);

    this.mealService.addMeal(meal).subscribe();
  }
}
