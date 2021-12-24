import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewMealComponent } from './new-meal/new-meal.component';
import { MealsComponent } from './home/meals/meals.component';
import { MealResolverService } from './new-meal/meal-resolver.service';
import { NotFoundComponent } from './not-found.component';

const routes: Routes = [
  {path: '', component: HomeComponent, children: [
      {path: '', component: MealsComponent},
      { path: 'meals/:id/edit',
        component: NewMealComponent,
        resolve: {meal: MealResolverService}},
    ]},
  {path: 'new-meal', component: NewMealComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
