import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Meal } from '../shared/meal.model';
import { MealService } from '../shared/meal.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-meal',
  templateUrl: './new-meal.component.html',
  styleUrls: ['./new-meal.component.css']
})
export class NewMealComponent implements OnInit {
  @ViewChild('mealForm') mealForm!: NgForm;
  isEdit = false;
  editedId = '';

  constructor(
    private mealService: MealService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(result => {
      const meal = <Meal | null>result.meal;

      if (meal) {
        this.isEdit = true;
        this.editedId = meal.id;
        this.setFormValue({
          description: meal.description,
          calories: meal.calories,
          mealTime: meal.mealTime,
          date: meal.date,
        })
      } else {
        const date = new Date().toISOString().slice(0, 10);
        this.isEdit = false;
        this.editedId = '';
        this.setFormValue({
          description: '',
          calories: '',
          mealTime: '',
          date: date,
        })
      }
    })
  }

  setFormValue(value: { [key: string]: string | number }) {
    setTimeout(() => {
      this.mealForm.setValue(value);
    });
  }

  onSave() {
    const id = this.editedId || 'id';
    const meal = new Meal(
      id,
      this.mealForm.value.description,
      this.mealForm.value.calories,
      this.mealForm.value.mealTime,
      this.mealForm.value.date
    );
    if (this.isEdit) {
      this.mealService.editMeal(meal).subscribe();
    } else {
      this.mealService.addMeal(meal).subscribe();
    }
  }
}
