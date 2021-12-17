import { Component, OnInit } from '@angular/core';
import { Question, Answer, Modus } from '../dateninterfaces';
import { DatabaseMysqlService } from '../database-mysql.service';
import { ActivatedRoute, NavigationStart, Router, Event } from '@angular/router';

@Component({
  selector: 'lps-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {


  selectedQuestion?: Question;
  answerByQuestion: Answer = { id: 0, answers: [] };
  answerByUser: Answer = { id: 0, answers: [] };
  questionURIid: Number = 0;
  modus?: Modus;
  showhelp: Boolean = false;
  beantWortetStatus: Boolean = false;

  constructor(
    private db: DatabaseMysqlService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.modus = this.db.getMode();

    // Beim wechseln einer Frage sollen bestimmte Aktionen ausgeführt werden.
    // z.b Das der Hilfetext ausgeblendet wird.
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
          this.showhelp = false;
      }
  });

  }

  ngOnInit(): void {

    this.route.paramMap.subscribe(nav =>{
      this.questionURIid = Number(nav.get('questionId'));
      this.db.getQuestionById(this.questionURIid).subscribe(res => this.selectedQuestion = res);
      this.db.getAnswerById(this.questionURIid).subscribe(res => this.answerByQuestion = res);
    });


  }

  toggleHelp() {
     return this.showhelp ? this.showhelp = false : this.showhelp = true;
  }

  checkanswer(questionID: Number, answerID: any): Boolean{
    this.db.getAnswerById(questionID).subscribe(res => {
      if(res.answers[answerID] == '1') { this.beantWortetStatus = true; }
      if(res.answers[answerID] == '0') { this.beantWortetStatus = false; }
    });
    return this.beantWortetStatus;
  }
}
