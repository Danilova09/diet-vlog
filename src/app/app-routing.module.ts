import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewMealComponent } from './new-meal/new-meal.component';
import { MealsComponent } from './home/meals/meals.component';
import { MealResolverService } from './home/meals/meal-item/meal-resolver.service';

const routes: Routes = [
  {path: '', component: HomeComponent, children: [
      {path: '', component: MealsComponent},
      { path: 'meals/:id/edit',
        component: NewMealComponent,
        resolve: {meal: MealResolverService}},
    ]},
  {path: 'new-meal', component: NewMealComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
