import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningStartComponent } from './learning-start/learning-start.component';
import { SimulateTestComponent } from './simulate-test/simulate-test.component';
import { StartsiteComponent } from './startsite/startsite.component';
import { TestYourselfComponent } from './test-yourself/test-yourself.component';

const routes: Routes = [
  { path: 'start', component: StartsiteComponent },
  {
    path: 'learning', component: LearningStartComponent },
  { path: 'learning/:questionPool', component: LearningStartComponent },
  { path: 'learning/:questionPool/:questionId', component: StartsiteComponent },
  { path: 'vorpruefung', component: TestYourselfComponent },
  { path: 'vorpruefung/:qusestionPool/:questionId', component: TestYourselfComponent },
  { path: 'pruefung', component: SimulateTestComponent },
  { path: '',   redirectTo: '/start', pathMatch: 'full' },
  { path: '**', component: StartsiteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
