import { Component, OnInit } from '@angular/core';
import { questions, questionPools } from '../mock-daten';
import { Router } from '@angular/router';

@Component({
  selector: 'lps-learning-start',
  templateUrl: './learning-start.component.html',
  styleUrls: ['./learning-start.component.css']
})

export class LearningStartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

   }

   frageSelectiert: Boolean = false;
   questions = questions;
   questionPool = questionPools;

}
