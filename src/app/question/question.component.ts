import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Question, Answer, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, Router, Event, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'lps-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {


  selectedQuestion?: Question;
  answerByQuestion: Answer = { id: 0, answers: [] };
  questionURIid: Number = 0;
  modus?: Modus;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {

    // Damit IMMER die richtige ID übergeben wird muss man auf das ROUTING subscriben =)
    this.route.paramMap.subscribe(nav =>{
      this.questionURIid = Number(nav.get('questionId'));
      this.db.getQuestionById(this.questionURIid).subscribe(res => this.selectedQuestion = res);
      this.db.getAnswerById(this.questionURIid).subscribe(res => this.answerByQuestion = res);
    });
  }

}
