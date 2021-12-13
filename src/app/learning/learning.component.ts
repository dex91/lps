import { Component, OnInit } from '@angular/core';
import { questions, questionPools } from '../mock-daten';
import { Router } from '@angular/router';

@Component({
  selector: 'lps-start',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})

export class LearningComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

   }

   frageSelectiert: Boolean = false;
   questions = questions;
   questionPool = questionPools;

}
