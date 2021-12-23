import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NewMealComponent } from './new-meal/new-meal.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'new-meal', component: NewMealComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
