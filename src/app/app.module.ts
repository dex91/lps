import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { StartsiteComponent } from './startsite/startsite.component';
import { HeaderComponent } from './header/header.component';
import { LearningStartComponent } from './learning-start/learning-start.component';
import { TestYourselfComponent } from './test-yourself/test-yourself.component';
import { SimulateTestComponent } from './simulate-test/simulate-test.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    StartsiteComponent,
    HeaderComponent,
    LearningStartComponent,
    TestYourselfComponent,
    SimulateTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
