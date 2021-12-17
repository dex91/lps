import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LearningComponent } from './learning/learning.component';
import { SimulateTestComponent } from './simulate-test/simulate-test.component';
import { StartsiteComponent } from './startsite/startsite.component';
import { TestYourselfComponent } from './test-yourself/test-yourself.component';

const routes: Routes = [
  { path: 'start', component: StartsiteComponent },
  { path: 'learning', component: LearningComponent },
  { path: 'learning/:poolURIName',
    children: [
      { path: ':questionId', pathMatch: 'full', component: LearningComponent },
      { path: '', pathMatch: 'full', component: LearningComponent },
    ]
  },

  { path: 'vorpruefung', component: TestYourselfComponent },
  { path: 'vorpruefung/:poolURIName',
    children: [
      { path: ':questionId', pathMatch: 'full', component: TestYourselfComponent },
      { path: '', pathMatch: 'full', component: TestYourselfComponent },
    ]
  },

  { path: 'pruefung', component: SimulateTestComponent },
  { path: 'pruefung/:poolURIName',
    children: [
      { path: ':questionId', pathMatch: 'full', component: SimulateTestComponent },
      { path: '', pathMatch: 'full', component: SimulateTestComponent },
    ]
  },

  { path: '',   redirectTo: '/start', pathMatch: 'full' },
  { path: '**', component: StartsiteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
