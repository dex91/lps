import { Component, OnInit } from '@angular/core';
import { Answer, Question } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lps-start',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.css']
})

export class LearningComponent implements OnInit {

  frageSelectiert: Boolean = false;
  questions: Question[] = [];
  selectedQuestion?: Question;
  answerByQuestion: Answer = { id: 0, answers: [] };
  stopperVariableFuerTemplates: Boolean = false;
  date = new Date();


  constructor(
    private route: ActivatedRoute,
    private db: DatabaseMysqlService,
    ) {

      this.route.url.subscribe(params => {
         let questionURIid = Number(params[1].path);
        if (questionURIid == null || questionURIid == undefined || questionURIid == 0) {
          this.frageSelectiert = false;
        } else {
          this.frageSelectiert = true;
          this.getQuestionById(questionURIid);
          this.getAnswerById(questionURIid);
        }
      });

    }

  ngOnInit(): void {
    this.db.getAllQuestions().subscribe(res => this.questions = res);
   }

   getQuestionById(id: Number) {
    this.db.getQuestionById(id).subscribe(res => this.selectedQuestion = res);
   }

   getAnswerById(id: Number) {
    this.db.getAnswerById(id).subscribe(res => this.answerByQuestion = res);
   }
   formatDate(timestamp: any){
      return new Date(timestamp * 1000);
   }
}
